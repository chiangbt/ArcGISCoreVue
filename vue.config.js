const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    productionSourceMap: false,
    publicPath:'./',
    // assetsDir: './assets/',
    devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname, 'dist'),
        open: true,
        compress: true,
        hot: false,
        host: '0.0.0.0',
        port: 5000
    },
    chainWebpack: config =>{
        config.plugin('html')
          .tap(args => {
            args[0].title = "地理信息展示平台";
            return args;
          })
    },
    configureWebpack: config => {
        config.plugins.push(

        )
    }
}