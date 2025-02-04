const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/main.jsx', // Entry point for the app
    output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: 'bundle.js', // Single output bundle
        clean: true, // Clean the output directory before build
    },
    watch: true,
    resolve: {
        extensions: ['.js', '.jsx', '.json'], // Resolve these extensions
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/, // Transpile .js and .jsx files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'], // Babel for React and ES6+
                    },
                },
            },
            {
                test: /\.css$/, // Handle CSS files
                use: ['style-loader', 'css-loader'], // Inject styles into DOM
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/i, // Handle images
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name][ext]', // Output folder for assets
                },
            },
            {
                test: /\.json$/, // Handle JSON files
                type: 'json',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html', // Base HTML file for Webpack
            inject: 'body', // Inject scripts before closing </body>
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './public', // Copy public files (manifest.json, background.js, etc.)
                    to: './', // Copy to the root of the `dist` folder
                },
            ],
        }),
    ]
};



















// const CopyPlugin = require('copy-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const path = require('path');

// module.exports = {
//     entry: {
//         main: "./src/main.jsx",
//         App: "./src/App.jsx",
//     },
//     output: {
//         path: path.resolve(__dirname, 'dist'),
//         filename: 'src/[name].js',
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.(js|jsx)$/,
//                 exclude: /node_modules/,
//                 use: {
//                     loader: 'babel-loader',
//                     options: {
//                         presets: ['@babel/preset-env', '@babel/preset-react'],
//                     },
//                 },
//             },
//         ],
//     },
//     plugins: [new HtmlWebpackPlugin(
//         {
//             template: './index.html',
//             filename: 'index.html',
//             chunks: ['main'],
//         }
//     ),
//     new CopyPlugin({
//         patterns: [
//             { from: "./src/index.css" },
//             { from: "public" },
//         ],
//     }),
//     ],

// };