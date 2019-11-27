// https://github.com/michael-ciniawsky/postcss-load-config

var autoprefixer = require('autoprefixer')
// var pxtorem = require('postcss-pxtorem')

module.exports = {
  plugins: [
    autoprefixer({
      remove: false
    }),
    // pxtorem({
    //   rootValue: 75, //30
    //   unitPrecision: 3,
    //   propList: ['*', '!border', '!border-radius'],
    //   minPixelValue: 3,
    //   selectorBlackList: ['html']
    // })
  ]
}
