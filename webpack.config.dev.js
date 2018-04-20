var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        'ympaint': './src/ympaint.ts'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].min.js',
        publicPath: './dist',
        library: 'YMPaintSDK',
        libraryTarget: 'window'

    },
    module: {
        // 生成sourcemap
        rules: [{
            enforce: 'pre',
            test: /\.ts$/,
            loader: 'source-map-loader'
        }, {
            test: /\.ts$/,
            loader: 'ts-loader',
            exclude: /node_moudles/
        }]
    },
    resolve: {
        extensions: ['.ts']
    },
    devtool: 'inline-source-map'
};