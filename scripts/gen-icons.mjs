// Genera iconos PNG para el PWA sin dependencias externas
// Uso: node scripts/gen-icons.mjs
import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function makePng(size) {
  const VINO = [115, 3, 12, 255];      // #73030C
  const MOSTAZA = [244, 145, 23, 255]; // #F49117
  const radius = size * 0.22;

  // Geometría de la "U"
  const cx = size / 2;
  const uw = size * 0.44, uh = size * 0.52, t = size * 0.11;
  const uy = size * 0.24;
  const inU = (x, y) =>
    (x >= cx - uw / 2 && x <= cx - uw / 2 + t && y >= uy && y <= uy + uh) ||
    (x >= cx + uw / 2 - t && x <= cx + uw / 2 && y >= uy && y <= uy + uh) ||
    (x >= cx - uw / 2 && x <= cx + uw / 2 && y >= uy + uh - t && y <= uy + uh);

  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < size; x++) {
      const px = rowStart + 1 + x * 4;
      // Esquinas redondeadas
      const corners = [
        [radius, radius],
        [size - radius, radius],
        [radius, size - radius],
        [size - radius, size - radius],
      ];
      let inside = true;
      for (const [ccx, ccy] of corners) {
        const inCornerX = ccx === radius ? x < radius : x >= size - radius;
        const inCornerY = ccy === radius ? y < radius : y >= size - radius;
        if (inCornerX && inCornerY) {
          inside = (x - ccx) ** 2 + (y - ccy) ** 2 <= radius ** 2;
          break;
        }
      }
      const color = !inside ? [0, 0, 0, 0] : inU(x, y) ? MOSTAZA : VINO;
      raw.set(color, px);
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const outDir = path.join('public', 'icons');
fs.mkdirSync(outDir, { recursive: true });
for (const size of [192, 512]) {
  const file = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(file, makePng(size));
  console.log(`✓ ${file}`);
}
