const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/Main.ts'
    },
    //devtool: 'cheap-module-source-map',
    plugins: [ ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    optimization: {
        minimize: false
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/, loader: "ts-loader", options: {
                    configFile: 'tsconfig.dev.json'
                }
            }
        ]
    }
};