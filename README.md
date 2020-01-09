# stc-ui

> stc基础ui库 <a href="https://github.com/xiaodai123/stc-ui/tree/dev" target="_blank">github地址(https://github.com/xiaodai123/stc-ui/tree/dev)</a>

1. **项目启动**

   > npm install	安装依赖
   >
   > npm run dev	启动开发项目

2. **脚本**

   > npm run dll-dev	将第三方js打包到vendor.js(dev)。
   >
   > npm run dll-prod	将第三方js打包到vendor.js(prod)。
   >
   > npm run svg	将src\core\svgAssets下的svg文件对应的文件名收集到site\demo\svg.json；用于生成svgIcon.md中的图标展示列表。
   >
   > npm run server	启动文档工程(dev)。
   >
   > npm run prod	启动文档工程(prod)。
   >
   > npm run build	使用node启动文档工程(prod)。
   >
   > npm run linux-build	linux环境启动文档工程(prod)。
   >
   > npm run build:file	根据components.json生成src下的index.js入口文件。
   >
   > npm run test	启动karma测试脚本。对应脚本位置：test\specs。
   >
   > npm run lint	eslint格式化工程。

   ------

   >其他脚本注解（build目录下）
   >
   >node new.comps.js 'alert' 'Basic'
   >
   >这个脚本是用于自动生成组件文件以及其他附属文件内容。第二个参数是组件名（require）。第三个参数是指定属于哪个组件大类，默认值为‘Basic’。第四个参数是指定路由导航icon图标，默认值是'dashboard'。
   >
   >设计文件（以alert为例）：
   >
   >**src\core\packages\alert\index.js**
   >
   >**src\core\packages\alert\alert.scss**
   >
   >**src\core\packages\alert\src\main.vue**
   >
   >**src\core\packages\theme-chalk\index.scss**
   >
   >**src\components.json**
   >
   >**test\specs\alert.spec.js**
   >
   >**site\docs\componentsDocs\zh-CN\alert.md**
   >
   >**site\demo\route.config.json**

   ```js
   // src\core\packages\alert\index.js
   import Alert from './src/main';
   import './alert.scss';
   /* istannul ignore next */
   Alert.install = function(Vue) {
       Vue.component(Alert.name, Alert);
   };
   export default Alert;
   
   ```

   

   ```scss
   // src\core\packages\alert\alert.scss
   @import "../theme-chalk/mixins/mixins";
   @import "../theme-chalk/common/var";
   @include blo(alert) {
   }
   ```

   

   ```vue
   // src\core\packages\alert\src\main.vue
   <template>
       <div class="stc-alert"></div>
   </template>
   <script>
   export default {
       name: 'stc-alert'
   };
   </script>
   ```

   

   ```scss
   // src\core\packages\theme-chalk\index.scss
   @import "../alert/alert.scss";
   ```

   

   ```json
   // src\components.json
   "alert": "./core/packages/alert/index.js"
   ```

   

   ```js
   // test\specs\alert.spec.js
   /* eslint-disable no-undef */
   import { createTest, createVue, destroyVM } from '../util';
   import Alert from '@packages/alert';
   describe('Alert', () => {
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
           vm = createTest(Alert, true);
           expect(vm.$el).to.exist;
           expect(vm.$options.name).to.equal('STCAlert');
       })
   });
   ```

   

   ```markdown
   // site\docs\componentsDocs\zh-CN\alert.md
   # Alert
   
   ## 基本用法
   ```

   

   ```json
   // site\demo\route.config.json
   {
       "name": "AlertDemo",
       "path": "alertDemo",
       "componentPath": "/alert.md",
       "meta": {
           "icon": "dashboard",
           "title": "Alert"
       }
   }
   ```

   

3. **目录结构**

    ```markdown
    // 使用npm install mddir -g
    |-- stc-ui
        |-- .eslintignore	// eslint忽略配置文件
        |-- .eslintrc.js	// eslint校验规则
        |-- .gitignore	// git忽略配置文件
        |-- package-lock.json
        |-- package.json	// npm配置文件
        |-- README.md	// 说明页
        |-- build	// 构建目录
        |   |-- build.entry.js	// 自动生成src/index.js入口文件
        |   |-- karma.test.js	// karma测试配置文件
        |   |-- new.comps.js	// 自动生成组件及其他附属文件
        |   |-- config	// 公共配置目录
        |   |   |-- options.js	// 公共属性配置文件
        |   |   |-- postcss.js	// postcss配置文件
        |   |   |-- style-loader.js	// style配置文件
        |   |   |-- utils.js	// 配置工具文件
        |   |   |-- vue-loader.js	// vue配置文件
        |   |-- site	// 站点配置目录
        |       |-- base.config.js	// 基础webpack配置
        |       |-- build.js	// node启动prod
        |       |-- dev.config.js	// dev-webpack配置
        |       |-- dll.config.js	// dll-webpack配置
        |       |-- fundebug.config.js	// fundebug配置文件
        |       |-- icon.png	// 网站小图标
        |       |-- prod.config.js	// prod-webpack配置
        |       |-- svg.config.js	// svg文件名提取配置文件
        |-- site	// 站点目录
        |   |-- demo	// 站点工程目录
        |   |   |-- route.config.json	// 路由配置文件
        |   |   |-- svg.json	// svgname集合json
        |   |   |-- app	// 站点入口文件
        |   |   |   |-- demo.html
        |   |   |   |-- demo.js
        |   |   |-- assets	// 站点资源文件
        |   |   |   |-- css
        |   |   |   |   |-- public.css
        |   |   |   |-- image
        |   |   |   |   |-- logo.png
        |   |   |   |-- js
        |   |   |   |   |-- utils.js
        |   |   |   |   |-- vue_mixin.js
        |   |   |   |   |-- vue_prototype.js
        |   |   |   |-- svgAssets
        |   |   |-- components	// 站点公共组件文件夹
        |   |   |   |-- common
        |   |   |       |-- ExampleDemo	// 样例代码公共组件
        |   |   |       |   |-- index.vue
        |   |   |       |-- ScrollBar
        |   |   |           |-- index.vue
        |   |   |-- i18n	// 国际化配置
        |   |   |   |-- index.js
        |   |   |   |-- locales
        |   |   |       |-- en.js
        |   |   |       |-- zh.js
        |   |   |       |-- modules
        |   |   |           |-- en
        |   |   |           |   |-- route.js
        |   |   |           |-- zh
        |   |   |               |-- route.js
        |   |   |-- layout	// 布局文件夹
        |   |   |   |-- DefaultLayout.vue
        |   |   |   |-- AppMain
        |   |   |   |   |-- index.vue
        |   |   |   |-- NavBar
        |   |   |   |   |-- BreadCrumb.vue
        |   |   |   |   |-- Hamburger.vue
        |   |   |   |   |-- index.vue
        |   |   |   |   |-- InputSearch.vue
        |   |   |   |   |-- SelectLang.vue
        |   |   |   |-- SideBar
        |   |   |   |   |-- index.vue
        |   |   |   |   |-- MenuItem.vue
        |   |   |   |   |-- sideBar.scss
        |   |   |   |-- TagsView
        |   |   |       |-- index.vue
        |   |   |-- pages	// 页面文件夹
        |   |   |   |-- demo
        |   |   |       |-- demo.vue
        |   |   |       |-- testV
        |   |   |           |-- TestV.vue
        |   |   |-- router	// 路由
        |   |   |   |-- demo.js
        |   |   |-- static	// 静态文件夹
        |   |   |   |-- favicon.ico
        |   |   |   |-- fundebug
        |   |   |   |   |-- fundebug.js
        |   |   |   |-- lib
        |   |   |   |   |-- js
        |   |   |   |       |-- jquery-1.9.1.min.js
        |   |   |   |       |-- jquery-tableExport-new.js
        |   |   |   |       |-- polyfill.js
        |   |   |   |-- vendor	// dll生成的文件
        |   |   |       |-- manifest.json
        |   |   |       |-- vendor.js
        |   |   |-- store	// vuex文件夹
        |   |       |-- getters.js
        |   |       |-- index.js
        |   |       |-- modules
        |   |           |-- sideBar.js
        |   |           |-- tagsView.js
        |   |-- docs	// 目录文件夹
        |       |-- componentsDocs
        |       |   |-- es
        |       |   |   |-- alert.md
        |       |   |-- zh-CN
        |       |       |-- alert.md
        |       |       |-- demo.md
        |       |       |-- svgIcon.md
        |       |-- pdfDocs
        |           |-- Mocha.js官方文档翻译.pdf
        |           |-- 【Sass中级】使用Sass和Compass制作雪碧图.pdf
        |           |-- 为什么要用SVG？svg与iconfont、图片多维度对比.pdf
        |-- src	// 组件开发文件夹
        |   |-- components.json
        |   |-- index.js	// 入口文件
        |   |-- core
        |   |   |-- directives	// 指令
        |   |   |   |-- README.md
        |   |   |-- locale	// 国际化
        |   |   |-- mixins	// 混入
        |   |   |   |-- README.md
        |   |   |-- packages	// 组件文件夹
        |   |   |   |-- alert
        |   |   |   |   |-- alert.scss
        |   |   |   |   |-- index.js
        |   |   |   |   |-- src
        |   |   |   |       |-- main.vue
        |   |   |   |-- svgIcon
        |   |   |   |   |-- index.js
        |   |   |   |   |-- svg-icon.scss
        |   |   |   |   |-- src
        |   |   |   |       |-- main.js
        |   |   |   |-- theme-chalk	// 样式文件夹
        |   |   |       |-- index.scss
        |   |   |       |-- common
        |   |   |       |   |-- var.scss
        |   |   |       |-- mixins
        |   |   |           |-- config.scss
        |   |   |           |-- function.scss
        |   |   |           |-- mixins.scss
        |   |   |           |-- utils.scss
        |   |   |-- svgAssets	// svg文件夹
        |   |   |-- transitions	// 动画文件夹
        |   |   |   |-- README.md
        |   |   |-- utils	// 工具文件夹
        |   |       |-- README.md
        |   |-- platforms // 平台相关文件夹
        |       |-- mobile
        |       |   |-- README.md
        |       |-- web
        |           |-- README.md
        |-- test	// 测试文件夹
            |-- index.js	// 测试入口文件
            |-- karma.conf.js	// 测试配置文件
            |-- util.js	// 工具文件
            |-- coverage	// 覆盖率文件
            |-- specs	// 组件测试代码
                |-- alert.spec.js
                |-- svgIcon.spec.js
    
    ```
 
>>>>>>> 537f2b438ecee380b96a1d8b866a6145459b5a55
