// 入口文件需要添加此段代码才能实现局部热更新，https://webpack.js.org/guides/hot-module-replacement/#enabling-hmr
if (module.hot) module.hot.accept();

// 因为调用import()语法webpack会最后生成Promise语法，所以transform-runtime解析不了，需要先自定义全局Promise语法让其解析
window.Promise = Promise;

// 加载公共css
require('@demo/assets/css/public.css');
require('highlight.js/styles/github.css');


// 引入vue、element-ui（暂时使用）
import Vue from 'vue';

// 引入主路由文件
import Demo from '@demo/pages/demo/demo';

// 引入路由配置
import router, { routes } from '@demo/router/demo';

// 引入添加vue原型链
import '@demo/assets/js/vue_prototype';

// 引入i18n
import i18n from '@demo/i18n';

// 引入添加vue全局混入
import '@demo/assets/js/vue_mixin';

// 引入vuex
import store from '@demo/store';

// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false;

import STCUI from '@/index.js';
Vue.use(STCUI);

import ExampleDemo from '@demo/components/common/ExampleDemo';
Vue.component('ExampleDemo', ExampleDemo);

import svg from '../svg.json';
Vue.prototype.$svg = svg; // svg 列表页用

new Vue({
    el: '#index',
    data: {},
    router,
    i18n,
    store,
    render: h => h(Demo)
})
