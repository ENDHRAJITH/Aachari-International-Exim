import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aachari International Exim',
    short_name: 'Aachari Exim',
    description: 'Premium quality spices and powders exported from India. Moringa powder, turmeric, chilli and agricultural products.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F7F4',
    theme_color: '#C1622A',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
