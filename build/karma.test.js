const path = require('path');
const ProgressBarPlugin= require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const Options = require('./config/options');
const OptionBuild = Options.build;
const vueLoader = require('./config/vue-loader');
const { getBabelOptions } = require('./config/utils');


const webpackConfig = {
    mode: 'development',
    entry: {
        app: ['./src/index.js']
    },
    output: {
        path: path.resolve(process.cwd(), './dist'),
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[id].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            ...OptionBuild.alias,
            'vue$': 'vue/dist/vue.common.js',
            '@': path.join(__dirname, '..', 'src'),
            '~': path.join(__dirname, '..', 'src')
        },
        modules: ['node_modules']
    },
    module: {
        rules: [
            {
                test: /\.(jsx?|babel|es6)$/,
                include: process.cwd(),
                exclude: Options.jsexclude,
                use: [
                    {
                        loader: 'babel-loader',
                        options: getBabelOptions()
                    }
                ]
            },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: vueLoader
                    }
                ]
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: path.posix.join('static', '[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}

if(!process.env.CI_ENV) {
    webpackConfig.plugins.push(
        new ProgressBarPlugin()
    )
}

module.exports = webpackConfig;