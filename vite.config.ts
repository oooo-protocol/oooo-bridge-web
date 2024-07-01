import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { createHtmlPlugin } from 'vite-plugin-html'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const variables = loadEnv(mode, process.cwd())
  const isAnalyze = process.argv.includes('analyze')
  const isUploadSentry = process.argv.includes('upload-sentry')
  const version = process.env.npm_package_version

  return {
    server: {
      host: '0.0.0.0'
    },
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: [
          'vue',
          'vue-i18n',
          'vue-router'
        ],
        dts: true,
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        }
      }),
      // refer: https://github.com/sxzz/unplugin-vue-macros/tree/main/packages/define-options
      DefineOptions(),
      VueI18nPlugin({
        include: [path.resolve(__dirname, './src/i18n/locales/**')]
      }),
      // Inject GA into index.html
      createHtmlPlugin({
        inject: {
          data: {
            injectGA: ['testnet', 'livenet'].includes(mode)
              ? `
              <!-- Google tag (gtag.js) -->
              <!-- Global site tag (gtag.js) - Google Analytics -->
              <!-- Google tag (gtag.js) -->
              <script async src="https://www.googletagmanager.com/gtag/js?id=G-462G4227BG"></script>
              <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-462G4227BG');
              </script>
              `
              : ''
          }
        }
      }),
      isUploadSentry
        ? sentryVitePlugin({
          org: 'oooo-7g',
          project: 'oooo-bridge',
          authToken: process.env.SENTRY_AUTH_TOKEN,
          release: {
            name: `${variables.VITE_NETWORK}@${version}`
          }
        })
        : undefined,
      isAnalyze
        ? visualizer({
          filename: path.resolve(__dirname, 'node_modules/rollup-plugin-visualizer/stats.html'),
          open: true
        })
        : undefined
    ],
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()]
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'oooo-components': path.resolve(__dirname, 'submodules/oooo-components/src')
      },
      extensions: [
        // add livenet/testnet extension to suitable for multi-env package
        `.${variables.VITE_MODE}.ts`, '.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'
      ]
    },
    define: {
      DEFINE_APP_VERSION: JSON.stringify(version)
    },
    build: {
      sourcemap: true
    }
  }
})
