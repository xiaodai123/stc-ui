const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./base.config');
const Options = require('../config/options');
const { getDllVendor, isDev, join, entryHtml } = require('../config/utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack4-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// 修改控制台输出的字体样式大小和背景
const chalk = require('chalk'); 

const devConfig = merge(baseConfig, {
    mode: 'development',
    // cheap-module-eval-source-map is faster for development
	//devtool: 'cheap-module-eval-source-map',
    devtool: 'cheap-source-map',
    output: {
        publicPath: `http://${Options.local.host}:${Options.local.port}/`
    },
    performance: {
        hints: false
    },
    devServer: {
        // contentBase: './dist',
        historyApiFallback: true, // 当使用html5 history api,将会在响应404时返回index.html。想要开启该功能进行如下设置。
        compress: false,
        hot: true,
        inline: true,
        // `webpack --colors` equivalent
        stats: { colors: true },
        // 当启用该配置，除了初始化信息会被写到console中，其他任何信息都不会被写进去。
        quiet: true, // necessary for FriendlyErrorsPlugin
        // 如果既想显示erros不想显示warnings，则如下配置
        overlay: {
            warnings: false,
            errors: true
        },
        // 对文件更改的监控配置
        // watchOptions: {
        //     poll: true
        // },
        disableHostCheck: true,
        host: Options.local.host,
        port: Options.local.port,
        proxy: Options.proxy
    },
    plugins: [
        /*
        // webpack4开发模式下自动设置，设置全局变量，代码中也可用
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: '"development"' },
        }),
       
       	// webpack4开发模式下自动设置，HMR shows correct file names in console on update.
        new webpack.NamedModulesPlugin(), 
        */
        // 打包过程，以百分比显示打包进度
        new ProgressBarPlugin({
            complete: chalk.green('█'), // 完成完成字符
            incomplete: chalk.white('█'),
            format: ' :bar ' + chalk.green.bold(':percent') + '(:elapsed seconds) :msg', // 进度条的格式
            clear: false // 选项以清除完成时的栏,默认为true
        }),
        // 启用热替换模块(Hot Module Replacement)，也被称为HMR。
        new webpack.HotModuleReplacementPlugin(),
        // 跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误。
        new webpack.NoEmitOnErrorsPlugin(),
        // 编译完成，成功、失败提示
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`Your application is running here: http://${Options.local.host}:${Options.local.port}/${Options.build.openPage}`]
            },
            onErrors: (severity, errors) => {
                if(severity !== 'error') {
                    return;
                }
                const notifier = require('node-notifier');
                const pkg = require('../../package.json');
                const error = errors[0];
                notifier.notify({
                    title: pkg.name,
                    message: severity + ': ' + error.name,
                    subtitle: error.file || '',
                    icon: join(__dirname, 'icon.png')
                })
            }
        }),
        // 编译完成，自动打开浏览器
        new OpenBrowserPlugin({
            url: `http://${Options.local.host}:${Options.local.port}/${Options.build.openPage}/`
        })
    ]
})

// options.js中的extend配置
if(typeof Options.build.extend === 'function') {
    const extendedConfig = Options.build.extend.call(this, devConfig, { isDev });
    // 只返回配置文件，以返回向后兼容。
    if(extendedConfig !== undefined) {
        devConfig = extendedConfig;
    }
}
// webpack可视化构建
if (Options.build.analyze) {
    devConfig.plugins.push(
        new BundleAnalyzerPlugin(Object.assign({}, Options.build.analyze))
    )
}

module.exports = new Promise((resolve, reject) => {
    entryHtml(devConfig, resolve);
})