var webpack = require("webpack");

var isprod = process.env.NODE_ENV === "production";
console.log(isprod ? "Production Mode" : "Development Mode");


var entry = isprod ? [ 
    "./app/entry.jsx"
] : [ 
    "webpack-dev-server/client?http://localhost:8080",
    "webpack/hot/only-dev-server",
    "./app/entry.jsx"
];


var plugins = isprod ? [
    new webpack.optimize.UglifyJsPlugin({
        compressor: {
            warnings: false
        }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin()
] : [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
];


module.exports = {
    output: {
        path: __dirname + "/dist/",
        filename: "bundle.js",
        publicPath: "http://localhost:8080/"
    },

    resolve: {
        extensions: ["", ".js", ".jsx"]
    },

    module: { loaders: [
        { test: /\.scss$/, loaders: ["style", "css", "sass"]},
        { test: /\.css$/, loaders: ["style", "css" ]},
        { test: /\.md$/, loaders:  ["html", "remarkable"]},
        { test: /\.html$/, loaders:  ["html"]},
        { test: /\.json$/, loaders: ["json"]},
        { test: /\.jsx?$/, loaders: isprod ? ["babel?stage=0"] : ["react-hot", "babel?stage=0"] , exclude: /node_modules/},
        { test: /\.(png|jpg|jpeg|gif|svg)$/, loaders: ["url?limit=10000"]},
        { test: /\.(woff|woff2)$/, loaders: ["url?limit=100000"]},
        { test: /\.(ttf|eot)$/, loaders: ["file"]},
        { test: /\.(mp3|wav)$/, loaders: ["file"]}
    ]},
    remarkable : {
        breaks: true,
        html: true
    },
    entry: entry,
    plugins: plugins,
    devtool: isprod ? null : "cheap-module-eval-source-map"
};
