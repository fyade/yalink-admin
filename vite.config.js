import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  return {
    // base: './',
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [AntDesignVueResolver()],
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE
          }
        }
      })
    ],
    resolve: {
      alias: {
        '@': join(__dirname, 'src'),
        'api': join(__dirname, 'src/api'),
        'utils': join(__dirname, 'src/utils'),
        'comp': join(__dirname, 'src/components'),
        'views': join(__dirname, 'src/views'),
        'store': join(__dirname, 'src/store')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import '@/assets/css/global.scss';`
        }
      }
    },
    server: {
      proxy: {
        [env.VITE_APP_REQ_PREFIX]: {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.substring(env.VITE_APP_REQ_PREFIX.length)
        }
      }
    }
  }
})
