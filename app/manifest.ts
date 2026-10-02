import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UTOPIA - Liga por Puntos',
    short_name: 'UTOPIA',
    description: 'Liga por puntos para equipos - Tabla de posiciones y enfrentamientos',
    start_url: '/',
    display: 'standalone',
    background_color: '#F3E1CE',
    theme_color: '#73030C',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
