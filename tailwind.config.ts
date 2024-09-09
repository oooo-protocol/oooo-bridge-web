import type { Config } from 'tailwindcss'
import OoooPreset from './submodules/oooo-components/src/config/tailwind.preset.js'

export default {
  presets: [
    OoooPreset as unknown as Config
  ],
  content: [
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './submodules/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}'
  ],
  theme: {
    extend: {
      animation: {
        'spin-reverse': 'spin-reverse 1s linear infinite'
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-360deg)' }
        }
      }
    }
  }
} satisfies Config
