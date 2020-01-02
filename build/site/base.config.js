const webpack = require('webpack');
const { resolve, join, getBabelOptions, getMdOptions, createLintingRule, isDev, entryJS } = require('../config/utils');
const Options = require('../config/options');
const OptionBuild = Options.build;
const styleLoader = require('../config/style-loader');
const vueLoader = require('../config/vue-loader');
// #vue-loader@15.*之后除了必须带有VueLoaderPlugin 之外，还需另外单独配置css-loader。
const vueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');

// webpack链式配置
const WebpackChain = require('webpack-chain');
const WebpackChainConfig = new WebpackChain();
OptionBuild.chainWebpack(WebpackChainConfig);

const HappyPack = require('happypack');
// 获取电脑的处理器有几个核心，作为配置传入
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });

const HappyPackFun = (id, loaders) => {
    return new HappyPack({
        // 用id来标识happypack处理哪类文件
        id,
        // 如何处理 用法和loader的配置一样
        loaders,
        // 共享进程池
        threadPool: happyThreadPool,
        // 允许HappyPack输出日志
        verbose: true
    })
}
const baseConfig = {
    entry: entryJS(),
    output: {
        path: resolve(__dirname, `../../${ OptionBuild.output.pathName || 'dist' }`),
        filename: OptionBuild.output.filename
            ? typeof(OptionBuild.output.filename) == 'function'
                ? OptionBuild.output.filename(isDev) : OptionBuild.output.filename
            : 'js/[name].js',
        chunkFilename: OptionBuild.output.chunkFilename
            ? typeof(OptionBuild.output.chunkFilename) == 'function' 
                ? OptionBuild.output.chunkFilename(isDev) : OptionBuild.output.chunkFilename 
            : 'js/[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.scss', '.less', '.json', '.json5'],
        alias: {
            ...OptionBuild.alias,
            // 'vue$': 'vue/dist/vue.esm.js',
            '@': join(__dirname, '../..', 'src'),
            '~': join(__dirname, '../..', 'src')
        }
    },
    module: {
        rules: [
            ...(OptionBuild.useEslint ? [createLintingRule()] : []),
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: vueLoader,
                    }
                ]
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: vueLoader,
                    },
                    {
                        loader: 'vue-markdown-loader/lib/markdown-compiler',
                        options: getMdOptions()
                    }
                ]
            },
            {
                test: /\.jsx?$/,
                use: 'happypack/loader?id=js',
                //exclude: [ resolve(__dirname, '../src/static') ],
                include: Array.isArray(OptionBuild.babelInclude) && OptionBuild.babelInclude.length > 0
                    ? OptionBuild.babelInclude
                    : [ resolve(__dirname, '../../src')]
            },
            {
                test: /\.json5$/,
                loader: 'json5-loader'
            },
            {
                test: /\.css$/,
                use: styleLoader.call(this, 'css')
            },
            {
                test: /\.less$/,
                use: styleLoader.call(this, 'less', 'less-loader')
            },
            {
                test: /\.sass$/,
                use: styleLoader.call(this, 'sass', {
                    loader: 'sass-loader',
                    options: { indentedSyntax: true }
                })
            },
            {
                test: /\.scss$/,
                use: styleLoader.call(this, 'scss', 'sass-loader')
            },
            // 需要用于构建组件库
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                options: {
                    symbolId: 'icon-[name]'
                },
                include: Array.isArray(OptionBuild.svgInclude) && OptionBuild.svgInclude.length > 0
                    ? OptionBuild.svgInclude
                    : [ resolve(__dirname, '../../src')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 1000, // 1KO
                    name: 'img/[name].[hash:7].[ext]'
                },
                exclude: Array.isArray(OptionBuild.urlExclude) && Array.isArray(OptionBuild.svgInclude) && OptionBuild.urlExclude.length > 0
                ? OptionBuild.urlExclude.concat(OptionBuild.svgInclude)
                : [ /node_modules/ ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 1000, // 1 KO
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(webm|mp4)$/,
                loader: 'file-loader',
                options: {
                    name: 'videos/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        // 采用多进程去打包构建--eslint
        ...(OptionBuild.useEslint ? [
            HappyPackFun('eslint', [
                {
                    loader: 'eslint-loader',
                    options: {
                        formatter: require('eslint-friendly-formatter')
                    }
                }
            ])
        ] : []),
        // 采用多进程去打包构建--js
        HappyPackFun('js', [
            {
                loader: 'cache-loader',
                options: {
                    cacheDirectory: resolve('node_modules/.cache/cacheLoaderJS')
                }
            },
            {
                loader: 'babel-loader',
                options: getBabelOptions()
            }
        ]),
        /*
        // 多进程打包css
        HappyPackFun('css', [
            {
                loader: 'css-loader',
                options: {
                    sourceMap: isDev,
                    importLoaders: 1 // 用于配置「css-loader 作用于 @import 的资源之前」有多少个 loader。
                    // 将来可能会取消该选项， 用optimize-css-assets-webpack-plugin代替
                    //minimize: !sourceMap
                }
            }
        ]),
        // 多进程打包less
        HappyPackFun('less', [
            {
                loader: 'less-loader',
                options: {
                    sourceMap: isDev
                }
            }
        ]),
        // 多进程打包sass
        HappyPackFun('sass', [
            {
                loader: 'sass-loader',
                options: {
                    indentedSyntax: true,
                    sourceMap: isDev,
                }
            }
        ]),
        // 采用多进程去打包构建--scss
        HappyPackFun('scss', [
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: isDev,
                }
            }
        ]),
        */
        // 启用Dll
        new webpack.DllReferencePlugin({
            context: join(__dirname, '../../site/demo'),
            manifest: require('../../site/demo/static/vendor/manifest.json')
        }),
        // 调用vueloader中的plugin.js
        new vueLoaderPlugin(),
        // 复制文件
        new CopyWebpackPlugin([{
            from: resolve(__dirname, '../../site/demo/static'),
            to: 'static'
        }])
    ].concat(OptionBuild.plugins),
    optimization: {
        splitChunks: {
            /*
	     	chunks: "async", 				// 必须三选一： "initial" | "all" | "async" (默认)
	     	minSize: 0, 					// 最小尺寸，默认0
	     	minChunks: 1, 					// 最小 chunk ，默认1
	     	maxAsyncRequests: 1, 			// 最大异步请求数， 默认1
	     	maxInitialRequests : 1, 		// 最大初始化请求书，默认1
	     	name: function(){}, 			// 名称，此选项可接收 function
             */
            maxAsyncRequests: 5,  
            maxInitialRequests: 3,  
            cacheGroups:{ 					// 这里开始设置缓存的 chunks
                vendor: { 					// key 为entry中定义的 入口名称
                    priority: 1, 			// 缓存组优先级
                    chunks: "all",
                    test: /[\\/]node_modules[\\/]babel-runtime/,
                    name: 'babel-runtime',
                },
                default: {
                    minChunks: 2,
                    chunks: "all",
                    priority: -10,
                    minSize: 30000,
                    reuseExistingChunk: true,
                    name: 'default-runtime'
                }
            }
        },
        // 对应每个entery入口文件生成对应的runtime~chunk文件名
		//runtimeChunk: true,
		// the default name is "runtime"
		//runtimeChunk: 'single',
		// specify another name
		runtimeChunk: {
            name: 'manifest'
        }
    }
}
module.exports = merge(WebpackChainConfig.toConfig(), baseConfig);

// 通过预热 worker 池(worker pool)来防止启动 worker 时的高延时。
/*
if(!isDev) {
    const threadLoader = require('thread-loader');
    threadLoader.warmup({
        // pool options, like passed to loader options
        // must match loader options to boot the correct pool
    }, [
        // modules to load
        // can be any module, i. e.
        'vue-loader',
        'cache-loader',
        'babel-loader',
        'babel-plugin-transform-runtime',
        'babel-preset-stage-2',
        'babel-preset-env',
        'uglifyjs-webpack-plugin',
        'optimize-css-assets-webpack-plugin',
        'mini-css-extract-plugin',
        'style-loader',
        'css-loader',
        'postcss-loader',
        'sass-loader',
        'cssnano',
    ]);
}
*/