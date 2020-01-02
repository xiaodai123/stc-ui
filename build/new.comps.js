console.log('new start');
const namespace = require('./config/options').namespace;

process.on('exit', () => {
    console.log('exit');
})

if(!process.argv[2]) {
    console.error('[组件名]必填 - Please enter new component name');
    process.exit(1);
}

const path = require('path');
const fs = require('fs');
// Streaming data to file and save it using Stream.(the module will make directory itself if the directory is not exist).
const fileSave = require('file-save');
const uppercamelcase = require('uppercamelcase');
const componentname = process.argv[2];
const componentType = process.argv[3] || 'Basic';
const componentIcon = process.argv[4] || 'dashboard';
const ComponentName = uppercamelcase(componentname);
const componentName = ComponentName.slice(0, 1).toLowerCase() + ComponentName.slice(1);

const packagePath = path.resolve(__dirname, '../src/core/packages', componentName);
const packageFiles = [
    {
        filename: 'index.js',
        content: `import ${ComponentName} from './src/main';
import './${componentname}.scss';
/* istannul ignore next */
${ComponentName}.install = function(Vue) {
    Vue.component(${ComponentName}.name, ${ComponentName});
};
export default ${ComponentName};`
    },{
        filename: 'src/main.vue',
        content: `<template>
    <div class="${namespace}-${componentname}"></div>
</template>
<script>
export default {
    name: '${namespace}-${componentname}'
};
</script>`
    },{
        filename: path.join('../../../../site/docs/componentsDocs/zh-CN', `${componentName}.md`),
        content: `# ${ComponentName}

## 基本用法
`
    },{
        filename: path.join('../../../../site/docs/componentsDocs/es', `${componentName}.md`),
        content: `
## ${ComponentName}

### Basic Usage
`
    },{
        filename: path.join('../../../../test/specs', `${componentName}.spec.js`),
        content: `
/* eslint-disable no-undef */
import { createTest, createVue, destroyVM } from '../util';
import ${ComponentName} from '@packages/${componentName}';
describe('${ComponentName}', () => {
    let vm;
    // 在这个作用域的所有测试用例运行之前运行
    before(() => {});
    // 在这个作用域的所有测试用例运行完之后运行
    after(() => {})
    // 在这个作用域的每一个测试用例运行之前运行
    beforeEach(() => {})
    // 在这个作用域的每一个测试用例运行之后运行
    afterEach(() => {
        destroyVM(vm);
    });
    it('create', () => {
        vm = createTest(${ComponentName}, true);
        expect(vm.$el).to.exist;
        expect(vm.$options.name).to.equal('STC${ComponentName}');
    })
});
`
    },{
        filename: `${componentname}.scss`,
        content: `
@import "../theme-chalk/mixins/mixins";
@import "../theme-chalk/common/var";
@include blo(${componentname}) {
}
`
    }
]

// 添加到components.json
const componentsJson = require('../src/components.json');
if(componentsJson[componentName]) {
    console.error(`${componentName} 已存在。`);
    process.exit(1);
}

componentsJson[componentName] = `./core/packages/${componentName}/index.js`;
fileSave(path.join(__dirname, '../src/components.json')).
    write(JSON.stringify(componentsJson, null, '  '), 'utf8').end('\n');


// 添加到 index.scss
const sassPath = path.join(__dirname, '../src/core/packages/theme-chalk/index.scss');
const sassImportText = `${fs.readFileSync(sassPath)}@import "../${componentName}/${componentname}.scss";`
fileSave(sassPath)
  .write(sassImportText, 'utf8')
  .end('\n');

// 创建package
packageFiles.forEach(packageFile => {
    fileSave(path.join(packagePath, packageFile.filename)).write(packageFile.content, 'utf8').end('\n');
});

// 添加到 route.config.json
const routeConfigJson = require('../site/demo/route.config.json');

routeConfigJson[componentType].children.push({
    name: `${ComponentName}Demo`,
    path: `${componentName}Demo`,
    // redirect: false,
    componentPath: `/${componentName}.md`,
    meta: {
        icon: componentIcon,
        title: ComponentName
    }
});
routeConfigJson[componentType].children.sort((a, b) => {
    return a.name < b.name ? -1 : 1;
})
fileSave(path.join(__dirname, '../site/demo/route.config.json'))
    .write(JSON.stringify(routeConfigJson, null, '  '), 'utf8')
    .end('\n');
console.log('Done!');




