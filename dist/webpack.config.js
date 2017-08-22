const path = require('path');

module.exports = {
    entry: ['babel-polyfill', './js/index.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'webpackdist')
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    }
};