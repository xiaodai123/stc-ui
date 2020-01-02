const path = require('path');

// node-path封装
const join = path.join;
const resolve = path.resolve;
exports.join = join;
exports.resolve = resolve;

// console.log('process.argv:', process.argv); // 获取参数：--config
// 是否为开发模式
const isDev = process.env.NODE_ENV == 'development';
exports.isDev = isDev;

// 设置babel-loader里的options配置
exports.getBabelOptions = () => {
    const Options = require('./options');
    let obj = Object.assign(
        { plugins: [] },
        {
            babelrc: false,
            // cacheDirectory: true,
            // plugins: [ 'transform-runtime', 'transform-vue-jsx' ],
        },
        Options.build.babel
    )
    const plugins = [
        // Stage 2
        // Compile class and object decorators to ES5
        // 将类和对象装饰器编译为ES5
        [ '@babel/plugin-proposal-decorators', { 'legacy': true } ], // 获得与transform-decorators-legacy新的装饰器规范版本相同的行为
        // Compile the function.sent meta property to valid ES2015 code
        // 将function.sent的meta属性编译为有效的ES2015代码
        '@babel/plugin-proposal-function-sent',
        // 将导出名称空间编译为ES2015
        // Compile export namespace to ES2015
        '@babel/plugin-proposal-export-namespace-from',
        // Remove numeric separators from Decimal, Binary, Hex and Octal literals
        // 从十进制，二进制，十六进制和八进制文字中删除数字分隔符
        '@babel/plugin-proposal-numeric-separator',
        // Wraps Throw Expressions in an IIFE
        // 在IIFE中包装引发表达式
        '@babel/plugin-proposal-throw-expressions',
        // es6
        // 外部化对助手和内置函数的引用，自动填充代码而不会污染全局变量
        '@babel/plugin-transform-runtime',
        // vue jsx
        'transform-vue-jsx',
        // support import()
        '@babel/plugin-syntax-dynamic-import'
    ]
    obj.plugins = Array.from(new Set(plugins.concat(obj.plugins)));
    if(!Options.build.babel.presets) {
        obj.presets = [
            /* [
                'vue-app',
                { ie: 9, unlify: true }
            ] */
            [
                '@babel/preset-env',
                {
                    // 'loose': true, // 是否使用宽松模式，如果设置为true，plugins里的插件如果允许，都会采用宽松模式。
                    'modules': false, // 将ES6模块语法转换为另一种模块类型，可选值: 各种流行的模块化规范："amd"、 "commonjs"、 "systemjs"、 "umd"禁止转译：false
                    'targets': ['> 1%', 'last 2 versions', 'not ie <= 8'] // 需要支持的环境
                }
            ]
            // '@babel/stage-2'
        ]
    }
    return obj;
}

// eslint配置
exports.createLintingRule = () => ({
    /* test: /\.js(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [ resolve(__dirname, '../../src'), resolve(__dirname, '../../site') ],
    options: {
        formatter: require('eslint-friendly-formatter'),
        // emitWarning: false
    } */
    // 使用happypack
    test: /\.(js|vue)$/,
    enforce: 'pre',
    use: 'happypack/loader?id=eslint',
    include: [ resolve(__dirname, '../../src'), resolve(__dirname, '../../site/demo') ],
    exclude: [ resolve(__dirname, '../../site/demo/static') ]
})

// 设置md-loader里的options配置
exports.getMdOptions = () => {
    const uslug = require('uslug');
    const uslugify = s => uslug(s);
    // const hljs = require('highlight.js');
    const markdownRender = require('markdown-it')({
        // highlight: function (str, lang) {
        //     if (lang && hljs.getLanguage(lang)) {
        //       try {
        //         return '<pre class="hljs"><code>' +
        //                hljs.highlight(lang, str, true).value +
        //                '</code></pre>';
        //       } catch (__) {}
        //     }
        
        //     return '<pre class="hljs"><code>' + markdownRender.utils.escapeHtml(str) + '</code></pre>';
        // }
    });
    return {
        raw: true,
        use: [
            [require('markdown-it-anchor'), {
                level: 2, // 添加超链接锚点的最小标题级别, 如: #标题 不会添加锚点
                slugify: uslugify,
                permalink: true, // 开启标题锚点功能
                permalinkBefore: false, // 在标题前创建锚点
                permalinkSymbol: '#',
                permalinkClass: 'sh-markdown-permalink'
            }],
            [require('markdown-it-container'), 'demo', {
                validate: function (params) {
                    // .*具有贪婪的性质，首先匹配到不能匹配为止，根据后面的正则表达式，会进行回溯。.*？则相反，一个匹配以后，就往下进行，所以不会进行回溯，具有最小匹配的性质。
                    return params.trim().match(/^demo\s+(.*)$/);
                },
                render: function (tokens, idx) {
                    if(tokens[idx].nesting === 1) {
                        // 获取第一行的内容使用markdown渲染html作为组件的描述
                        let demoInfo = tokens[idx].info.trim().match(/^demo\s+(.*)$/);
                        let description = (demoInfo && demoInfo.length > 1) ? demoInfo[1] : '';
                        let descriptionHTML = description ? markdownRender.render(description) : '';
                        //获取代码块内的html和js代码
                        let content = tokens[idx + 1].content;
                        // 3.使用自定义开发组件【ExampleDemo】来包裹内容并且渲染成案例和代码示例
                        return `<example-demo>
                        <div class="source" slot="source">${content}</div>
                        ${descriptionHTML}
                        <div class="highlight" slot="highlight">`;
                    }else {
                        return '</div></example-demo>\n';
                    }
                }
            }]
        ]
    }
}

// 使用DllPlugin打包公共文件，获取对应的文件名
let getDllVendor = (callback) => {
    const fs = require('fs');
    fs.readdir(resolve(__dirname, '../../site/demo/static/vendor'), (err, files) => {
        if(err) {
            console.log('error:', err.message);
            throw err.message;
            return;
        }
        let jsName = '';
        files.map((item) => {
            if(item.indexOf('vendor') > -1) {
                jsName = item;
                return;
            }
        })
        callback ? callback(jsName) : null;
    })
}
exports.getDllVendor = getDllVendor;

const Options = require('./options');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 根据 Options.build.entry里的配置生成对应入口js文件
exports.entryJS = () => {
    const list = Options.build.entry;
    let obj = {};
    list.forEach(item => {
        let name = item.js.substr(item.js.lastIndexOf('/') + 1).replace('.js', '');
        obj[name] = `./site/demo${item.js}`;
    })
    return obj;
}

// 根据 Options.build.entry里的配置生成对应入口html文件
exports.entryHtml = (config, resolve) => {
    const list = Options.build.entry;
    getDllVendor(jsVendor => {
        list.forEach(item => {
            let jsName = item.js.substr(item.js.lastIndexOf('/') + 1).replace('.js', '');
            let htmlName = item.html.substr(item.html.lastIndexOf('/') + 1).replace('.html', '');
            let htmlOptions = {
                jsVendor: '',
                filename: `${htmlName}.html`,
                template: './site/demo' + item.html,
                /*
                 * 1、true或者body：所有JavaScript资源插入到body元素的底部
                 * 2、head: 所有JavaScript资源插入到head元素中
                 * 3、false： 所有静态资源css和JavaScript都不会注入到模板文件中
                 * 向template或者templateContent中注入所有静态资源，不同的配置值注入的位置不经相同。
                 */
                inject: true,
                // function值可以指定具体排序规则；auto基于thunk的id进行排序； none就是不排序
                chunksSortMode: 'none',
                // 'default-runtime',
                chunks: ['manifest', 'babel-runtime', jsName]
            }
            // 生产模式
            if(!isDev) {
                // 压缩HTML文件
                htmlOptions.minify = {
                    removeComments: true, // 移除HTML中的注释
                    collapseWhitespace: true // 删除空白符与换行符
                    // removeAttributeQuotes: true, // 移除属性的引号
                }
                htmlOptions.jsVendor = jsVendor ? 
                `<script src="${Options.build.output.publicPath || '/'}static/vendor/${jsVendor}"></srcipt>`
                : '';
                if(Options.build.useFundebug) {
                    htmlOptions.jsFundebug = `<script src="${Options.build.output.publicPath || '/'}static/fundebug/fundebug.js" apikey="${Options.build.useFundebug}"></script>`
                }
            }else {
                htmlOptions.jsVendor = jsVendor 
	            ? `<script src="http://${Options.local.host}:${Options.local.port}/static/vendor/${jsVendor}"></script>` 
	            : '';
            }
            // 设置HtmlWebPackPlugin插件配置选项
            if(typeof Options.build.htmlOptions == 'function') {
                let host = !isDev ? Options.build.output.publicPath || '/' : `http://${Options.local.host}:${Options.local.port}/`;
                Options.build.htmlOptions(htmlOptions, { isDev, host });
            } else if (typeof Options.build.htmlOptions == 'object') {
				htmlOptions = Object.assign({}, htmlOptions, Options.build.htmlOptions);
            }
            config.plugins.push(
                // html打包，引入入口js文件
                new HtmlWebpackPlugin(htmlOptions)
            )
        })
        // ?
        // 生产时使用runtimeChunk插件打包公共文件，把manifest.js文件打包到html中减少一次http请求
        if(!isDev) {
            const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
            config.plugins.push(
				new InlineManifestWebpackPlugin('manifest')
			)
        }
        resolve(config);
    })
}
