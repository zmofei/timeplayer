const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/timepalyer.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'timeplayer.js',
        library: 'Timeplayer',
        libraryExport: 'default',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new CopyPlugin([
            { from: './public', to: './' },
        ]), 
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
};