const { join, isDev } = require('./utils');
const Options = require('./options');
//const createResolver = require('postcss-import-resolver');
module.exports = function postcssConfig(isArr) {
    const pluginsArr = [
        /*
        require('postcss-import')({
            resolve: createResolver({
                alias: {
                    '@': join(__dirname, '../..', 'site/demo'),
                    '~': join(__dirname, '../..', 'site/demo'),
                },
            })
        }),
        */
        // require('postcss-url')();
        // require('postcss-cssnext')(),
        // require('cssnano')({ safe: true }),
        require('autoprefixer')({ overrideBrowserslist: ['last 5 versions', 'Firefox >= 51'] }),
        ...(Options.build.postcssPlugins ? Options.build.postcssPlugins : [])
    ]
    return {
        sourceMap: isDev,
        useConfigFile: false,
        // ident: 'postcss',
        plugins: isArr ? pluginsArr : (loader) => pluginsArr
    }
}