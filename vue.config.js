const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: 'https://127.0.0.1:3000'
    // {
    //   '/api': {
    //     target: 'https://127.0.0.1:3000',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': 'rgb(54, 172, 60)'
          },
          javascriptEnabled: true
        }
      }
    }
  }
})
