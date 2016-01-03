var webpack = require("webpack");

module.exports = {
    devtool: "source-map",
    entry: [
        "./src/app/index.jsx"
    ],
    output: {
        path: __dirname + "/dist",
        filename: "editor.min.js"
    },
    module: {
        loaders: [{
            test: /\.jsx$|\.js?$/,
            loaders: ["babel"],
            exclude: /node_modules/
        }, {
            test: /\.js?|\.jsx$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ['react', 'es2015'],
                plugins: ['transform-runtime']
            }
        }, {
            test: /\.css$/,
            loader: "style!css"
        }, {
            test: /\.less$/,
            loader: "style!css!less"
        }, {
            test: /\.(png|jpg|svg)/,
            loaders: ['url', 'image-webpack'],
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
        }),
        new webpack.NoErrorsPlugin()
    ]
}
