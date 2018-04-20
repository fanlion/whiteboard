var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        'ympaint': './src/ympaint.ts'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: './dist',
        library: 'YMPaintSDK',

    },
    module: {
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