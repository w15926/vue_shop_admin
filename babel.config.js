// 生产环境中需要使用的插件
const productPlugins = []
if (process.env.NODE_ENV === 'production') return productPlugins.push("transform-remove-console")

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...productPlugins
  ]
}