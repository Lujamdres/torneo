'use client';

import { useState, useRef } from 'react';
import { playClick } from '@/lib/sounds';

const OPTIONS = ['Escaramuza A', 'Escaramuza B', 'Escaramuza C'];
const COLORS = ['#6600cc', '#00d9ff', '#ff3366'];
const SEGMENT_ANGLE = 360 / OPTIONS.length;

export function Roulette() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const wheelRef = useRef<SVGSVGElement>(null);

  const spin = () => {
    if (spinning) return;
    playClick();
    setSpinning(true);
    setResult(null);

    // Random extra turns (5-8 full rotations) + random final position
    const extraTurns = (5 + Math.random() * 3) * 360;
    const randomAngle = Math.random() * 360;
    const newRotation = rotation + extraTurns + randomAngle;

    setRotation(newRotation);

    // After animation ends, calculate result
    setTimeout(() => {
      // The pointer is at the top (0°). Calculate which segment is there.
      const finalAngle = newRotation % 360;
      // Pointer at top = 270° in standard coords, but we rotate clockwise.
      // The segment under the pointer: (360 - finalAngle) mod 360
      const pointerAngle = (360 - (finalAngle % 360)) % 360;
      const index = Math.floor(pointerAngle / SEGMENT_ANGLE) % OPTIONS.length;
      setResult(OPTIONS[index]);
      setSpinning(false);

      // Play a victorious sound for the result
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.value = 0.2;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }, 4000);
  };

  // Build SVG pie segments
  const buildSegmentPath = (index: number) => {
    const startAngle = (index * SEGMENT_ANGLE - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
    const radius = 120;
    const cx = 150, cy = 150;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index: number) => {
    const midAngle = ((index + 0.5) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
    const radius = 75;
    const cx = 150, cy = 150;
    return {
      x: cx + radius * Math.cos(midAngle),
      y: cy + radius * Math.sin(midAngle),
    };
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
        // SELECTOR DE ESCARAMUZA
      </h3>

      <div className="relative">
        {/* Pointer triangle at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-white drop-shadow-lg" />
        </div>

        {/* Glow ring */}
        <div className={`absolute inset-[-8px] rounded-full transition-all duration-300 ${
          spinning ? 'bg-gradient-to-r from-[#6600cc] via-[#00d9ff] to-[#ff3366] animate-spin opacity-30 blur-md' : 'opacity-0'
        }`} style={{ animationDuration: '2s' }} />

        {/* Wheel */}
        <svg
          ref={wheelRef}
          width="300"
          height="300"
          viewBox="0 0 300 300"
          className="drop-shadow-2xl cursor-pointer"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
          onClick={spin}
        >
          {/* Outer ring */}
          <circle cx="150" cy="150" r="140" fill="none" stroke="#6600cc" strokeWidth="3" opacity="0.5" />
          <circle cx="150" cy="150" r="122" fill="none" stroke="#00d9ff" strokeWidth="1" opacity="0.3" />

          {OPTIONS.map((option, i) => {
            const textPos = getTextPosition(i);
            const midAngle = (i + 0.5) * SEGMENT_ANGLE - 90;
            return (
              <g key={i}>
                <path
                  d={buildSegmentPath(i)}
                  fill={COLORS[i]}
                  stroke="#0f1923"
                  strokeWidth="2"
                  opacity="0.85"
                  className="hover:opacity-100 transition-opacity"
                />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="13"
                  fontWeight="900"
                  letterSpacing="1"
                  transform={`rotate(${midAngle}, ${textPos.x}, ${textPos.y})`}
                  className="uppercase select-none pointer-events-none"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                >
                  {option}
                </text>
              </g>
            );
          })}

          {/* Center circle */}
          <circle cx="150" cy="150" r="25" fill="#0f1923" stroke="#00d9ff" strokeWidth="2" />
          <text
            x="150"
            y="150"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#00d9ff"
            fontSize="10"
            fontWeight="900"
            letterSpacing="1"
            className="uppercase select-none pointer-events-none"
          >
            SPIN
          </text>
        </svg>
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinning}
        className={`px-8 py-3 font-black uppercase tracking-widest text-sm border-2 transition-all duration-300 ${
          spinning
            ? 'border-gray-600 text-gray-600 cursor-not-allowed'
            : 'border-[#00d9ff] text-[#00d9ff] hover:bg-[#00d9ff]/10 hover:shadow-lg hover:shadow-[#00d9ff]/20 active:scale-95'
        }`}
      >
        {spinning ? 'GIRANDO...' : 'GIRAR RULETA'}
      </button>

      {/* Result */}
      {result && !spinning && (
        <div className="mt-2 p-4 border-2 border-[#00d9ff] bg-[#00d9ff]/10 text-center animate-pulse">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Resultado</p>
          <p className="text-2xl font-black text-[#00d9ff] uppercase tracking-wider">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}
