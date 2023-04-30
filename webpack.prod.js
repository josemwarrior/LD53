// webpack needs to be explicitly required
const webpack = require('webpack')
// if .env is on same folder as webpack.config.js
// same as above, but with abstraction
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    plugins: [
        new CompressionPlugin()
    ],
    entry: './src/Main.ts',
    output: {
        filename: 'bundle.js'
    },
    mode: 'production',
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/, loader: "ts-loader", options: {
                    configFile: 'tsconfig.prod.json'
                }
            }
        ]
    }
};