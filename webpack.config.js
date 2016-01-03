var webpack = require("webpack");
module.exports = {
    devtool: "source-map",
    entry: [
        "webpack-dev-server/client?http://localhost:8080",
        "webpack/hot/only-dev-server",
        "./src/app/index.jsx"
    ],
    output: {
        path: __dirname + "/dist",
        filename: "editor.js",
        publicPath: "/assets/"
    },
    module: {
        loaders: [{
                test: /\.jsx$|\.js?$/,
                loaders: ["react-hot", "babel"],
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
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};
