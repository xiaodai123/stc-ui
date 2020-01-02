const styleLoader = require('./style-loader');
const postcssConfig = require('./postcss');
const { getBabelOptions, isDev, resolve } = require('./utils');
module.exports = {
    postcss: postcssConfig.call(this, true),
    extractCss: !isDev, // 提取css,
    cssSourceMap: isDev,
    preserveWhitespace: false, // 放弃模板标签之间的空格
    /* 是否使用 webpack 的模块热替换在浏览器中应用变更而不重载整个页面。 
    用这个选项 (值设为 false) 在开发环境下关闭热重载特性。 */
    hotReload: true, // true 会强制热重载，即便是生产环境或 target: 'node' 时
    /* 设置为true的时候会开启基于文件系统的选项缓存，
    使得主vue-loader的选项可以分享给其他线程中的子loader。
    只有和HappyPack或thread-loader配合使用的时候才用的到 */
    threadMode: true,
    loaders: {
        js: [{
            loader: 'cache-loader',
            options: {
                cacheDirectory: resolve('node-modules/.cache/cache-loader-vue-script')
            }
        }, {
            loader: 'babel-loader',
            options: getBabelOptions()
        }],
        css: styleLoader.call(this, 'css', [], true),
        less: styleLoader.call(this, 'less', 'less-loader', true),
        scss: styleLoader.call(this, 'scss', 'sass-loader', true),
        // 对于sass扩展名，indentedSyntax选项具有真实值。
        sass: styleLoader.call(this, 'sass', { loader: 'sass-loader', options: { indentedSyntax: true } }, true)
    },
    // 去除引用时的require
    transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        avatar: 'src',
        image: 'xlink:href'
    }
}