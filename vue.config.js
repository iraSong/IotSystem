const path = require('path')
const glob = require('glob')
const titles = require('./title.js')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname,dir)
}
//配置pages多页面获取当前文件夹下的html和js
function getEntry(globPath) {
  let entries = {},
    basename, tmp, htmlName
  glob.sync(globPath).forEach(function(entry) {
    basename = path.basename(entry, path.extname(entry))
    tmp = entry.split('/').splice(-3)
    htmlName = tmp[tmp.length -1].replace('.wp.js', '')
    entries[basename] = {
      entry,
      template: 'public/index.html',
      title: titles[htmlName],
      filename: `${htmlName}.html`
    }
  })
  return entries
}
let pages = getEntry('./src/pages/**/*.wp.js')
// 自定义页面配置 请在这里添加
// pages['experience'] = {
//   entry: 'src/pages/experience/experience.js',
//   template: 'public/index.html',
//   filename: 'experience.html'
// }

const IS_PROD = ['production', 'test'].includes(process.env.NODE_ENV)
const extractConfig =  {
  filename: 'css/[name].css?v=[hash]',
  chunkFilename: 'css/[name].css?v=[hash]'
}

module.exports = {
  pages,
  publicPath: '',
  runtimeCompiler: true,
  productionSourceMap: false,
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码 (在生产构建时禁用 eslint-loader)
  // 是否开启eslint保存检测 ,它的有效值为 true || false || 'error'
  // lintOnSave: process.env.NODE_ENV !== 'production' ? 'error' : false,
  lintOnSave: false,

  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .tap(options => Object.assign({}, options, {
        name: 'img/[name].[ext]'
      }))

    config.resolve.alias
      .set('@',resolve('./src'))
      .set('@public',resolve('./public'))
      .set('@assets',resolve('./src/assets'))
      .set('@components',resolve('./src/components'))
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: IS_PROD ? extractConfig : false,
    sourceMap: false,
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
  },
  configureWebpack: {
    externals: {
      AMap: "window.AMap"
    },
    output: {
      filename: 'js/[name].js?v=[hash]',
      chunkFilename: 'js/[name].js?v=[hash]'
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ],
  }
}