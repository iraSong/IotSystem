const path = require('path')
const glob = require('glob')
const titles = require('./title.js')

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

module.exports = {
  pages,
  publicPath: '',
  runtimeCompiler: true,
  productionSourceMap: false,
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
    sourceMap: false,
    extract: {
      filename: 'css/[name].css?v=[hash]',
      chunkFilename: 'css/[name].css?v=[hash]'
    }
  },
  configureWebpack: {
    externals: {
      AMap: "window.AMap"
    },
    output: {
      filename: 'js/[name].js?v=[hash]',
      chunkFilename: 'js/[name].js?v=[hash]'
    }
  }
}