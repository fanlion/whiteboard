var path = require('path');
var webpack = require('webpack');
var UglifyJsWbpackPlugin = require('uglifyjs-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        'ympaint': './src/ympaint.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].min.js',
        publicPath: "./dist",
        library: 'YMPaintSDK',
        libraryTarget: "window" // 小程序用 umd，浏览器用 window
    },
    plugins: [
        new webpack.DefinePlugin({  // 定义环境，使用第三方包时也许需要
            'process.env': 'production'
        }),
        new CleanWebpackPlugin([path.resolve(__dirname, 'dist')], {   // 清除发布目录
            verbose: true
        }),
        new CopyWebpackPlugin([{  // 把ts编译的js拷贝到发布目录
            from: 'src/ympaint.js',
            to: path.join(__dirname, 'dist')
        }]),
        new UglifyJsWbpackPlugin({
            sourceMap: true,
        })
    ]
};