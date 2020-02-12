
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module .exports = {
    node: {
        fs: 'empty',
        net: 'empty',
    },
    entry : './script.js' ,
    output : {
        path: path.resolve(__dirname, 'dist'),
        filename : './bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css')
    ]
};