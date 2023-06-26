import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), 
    vueJsx(),
    AutoImport({
    // global imports to register
    imports: [
      // presets
      'vue',
      'vue-router',
      {
        'naive-ui': [
          'useDialog',
          'useMessage',
          'useNotification',
          'useLoadingBar'
        ]
      },
      // custom
      {
        '@vueuse/core': [
          // named imports
          'useMouse', // import { useMouse } from '@vueuse/core',
          // alias
          ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
        ],
        'axios': [
          // default imports
          ['default', 'axios'], // import { default as axios } from 'axios',
        ],
        '[package-name]': [
          '[import-names]',
          // alias
          ['[from]', '[alias]'],
        ],
      },
      // example type import
      {
        from: 'vue-router',
        imports: ['RouteLocationRaw'],
        type: true,
      },
    ],
    // Enable auto import by filename for default module exports under directories
    defaultExportByFilename: false,
    // Auto import inside Vue template
    // see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72
    vueTemplate: false,
  
    // Inject the imports at the end of other imports
    injectAtEnd: true,
  
    // Generate corresponding .eslintrc-auto-import.json file.
    // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
    eslintrc: {
      enabled: false, // Default `false`
      filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
      globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    },
  }),
  Components({
    resolvers: [NaiveUiResolver()]
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
