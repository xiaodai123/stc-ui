const path = require('path');
const resolve = path.resolve;
const join = path.join;

module.exports = {
    build: {
        // webpack链式配置
        chainWebpack: config => {
            // https://github.com/neutrinojs/webpack-chain/tree/v4
            // 例子
            // config.module
            //     .rule('svg')
            //     .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
            //     .use('file-loader')
            //     .loader('raw-loader');
        },
        // 针对build后分析并可视化构建后的打包文件，你可以基于分析结果来决定如何优化它，默认为false
        analyze: false,
        // 打包进行扩展配置，config参数为当前webpack返回配置内容，如果你想使用vux移动ui库可在此选项下配置
        extend: (config, { isDev }) => {
            // config.plugins.push();
            // return config;
        },
        // 设置babel-loader里的include选项，默认为include为src目录和site目录[ path.resolve(__dirname, '../../src'), path.resolve(__dirname, '../../site') ]
        babelInclude: [
            resolve(__dirname, '../../src'),
            resolve(__dirname, '../../site/demo')
        ],
        svgInclude: [
            resolve(__dirname, '../../site/demo/assets/svgAssets'),
            resolve(__dirname, '../../src/core/svgAssets')
        ],
        urlExclude: [
            /node_modules/
        ],
        // js编译设置，暂时放开，先使用element-ui
        babel: {
            plugins: [
                [
                    'component',
                    {
                        libraryName: 'element-ui',
                        styleLibraryName: 'theme-chalk'
                    }
                ]
            ]
        },
        // webpack加入插件
        plugins: [],
        // postcss加入插件
        postcssPlugins: [],
        // 如需修改请重新运行npm run dll打包公共js， 默认为['vue', 'axios', 'vue-router', 'vuex']
        vendor: ['vue-i18n'],
        // 是否使用eslint，默认使用
        useEslint: true,
        // 生成环境下是否使用fundebug,如果使用请传入创建项目时生成apikey，并运行npm run fundebug生成fundebug.js文件（生成一次好），默认空字符串为不使用
        useFundebug: 'e61d8875d099a74feb704e34ce2c9857a3bc84cefcaa8df9764a615994f7fc11',
        // useFundebug: '',
        // webpack中的output设置
        output: {
            // 默认打包生成dist文件名
            pathName: '',
            // str 'js/[name].js' / fun (isDev) => { return isDev ? 'js/[name].js' : 'js/[name].[chunkhash:3].js' }
            filename: '',
            // str 'js/[name].js' / fun (isDev) => { return isDev ? 'js/[name].js' : 'js/[name].[chunkhash:3].js' }
            chunkFilename: '',
            // npm run build时设置访问路劲， 默认为'/'
            publicPath: '/webpack4/dist/'
        },
        // 设置别名，默认'@'、'~'都指向'~src'文件夹下，并且这两个不可替换，如果加入新的快捷别名请使用别的字符
        alias: {
            '@core': join(__dirname, '../..', 'src/core'),
            '@platforms': join(__dirname, '../..', 'src/platforms'),
            '@directives': join(__dirname, '../..', 'src/core/directives'),
            '@locale': join(__dirname, '../..', 'src/core/locale'),
            '@mixins': join(__dirname, '../..', 'src/core/mixins'),
            '@packages': join(__dirname, '../..', 'src/core/packages'),
            '@transitions': join(__dirname, '../..', 'src/core/transitions'),
            '@utils': join(__dirname, '../..', 'src/core/utils'),
            '@demo': join(__dirname, '../..', 'site/demo'),
            '@docs': join(__dirname, '../../', 'site/docs/componentsDocs')
        },
        // 开发环境下默认打开地址为http://host:port/ 指向目录下的index.html,可修改为打开其他页面
        openPage: 'demo.html',

        // 设置HtmlWebpackPlugin插件配置选项，当前参数可为object或function；htmlOptions: {}; htmlOptions(config, { isDev, host }) {}
        // htmlOptions: {},
        // htmlOptions(config, { isDev, host }) {},
        htmlOptions(config, { isDev, host }) {
            config.jsPolyfill = `
                <script>
                    var ua = window.navigator.userAgent;
                    var oldIe = ua.indexOf('MSIE');
                    var newIe = ua.indexOf('Trident/');
                    if ((oldIe > -1) || (newIe > -1)) {
                        var script = document.createElement('script');
                        script.src = '/static/lib/js/polyfill.js';
                        document.querySelector('head').appendChild(script);
                    }
                </script>
            `
        },
        // 设置入口html文件和对应的js文件，默认指向site/demo文件夹路径下('../../site/demo')
        entry: [
            {
                html: '/app/demo.html',
                js: '/app/demo.js'
            }
        ]
    },
    // 开发模式下配置反向代理
    proxy: {
        // '/cq-ocms': {
        //     target: 'http://sit.cuniq.com',
        //     changeOrigin: true,
        //     secure: false
        //     // pathRewrite: { '^/cq-ocms' : '/' }
        // }
    },
    // 开发模式下访问地址
    local: {
        host: 'localhost',
        port: 9000
    },
    jsexclude: /node_modules|utils\/popper\.js|utils\/date\.js/,
    namespace: 'stc'
}