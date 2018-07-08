const path = require('path');
const HtmlWebpackPLugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: "./src/js/index.js"
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
        chunks: 'all'
      }
    },
    module: {
        rules: [
            {test: /\.css$/, use: ['style-loader', 'css-loader' ]}
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPLugin({template: './index.html', title: "Bzg App Books 1"}),
        new CopyWebpackPlugin([{
            from: './src/components/**/*',
            to: 'components/[name].[ext]',
            toType: 'template'
        }], { ignore: [ '*.js', '*.css' ]}),
        new CopyWebpackPlugin([
            {
              from: './src/data/books.json',
              to: 'data/books.json',
              toType: 'file'
            }
          ]),
        new webpack.ProvidePlugin({
            $:'jquery',
            jQuery: 'jquery'
        }),
        new webpack.ProvidePlugin({
            Ractive: 'ractive/ractive.min.js'
        })
    ]
}