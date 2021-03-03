module.exports = {
  chainWebpack: config => {
    // 生产环境使用的 main.js
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-pro.js')

      config.set('externals', { // 根据命名自动引入外用资源，在 index.html里配合使用
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      config.plugin('html').tap(args => { // 根据不同环境引入不同文件，配合 index.html里 <%= %>
        args[0].isProd = true
        return args
      })
    })

    // 开发环境使用的 main.js
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}