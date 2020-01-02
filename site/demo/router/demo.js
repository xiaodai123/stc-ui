
import Vue from 'vue';
import LayoutDefault from '@demo/layout/DefaultLayout';
import VueRouter from 'vue-router';
const path = require('path');

Vue.use(VueRouter);
/* webpackChunkName: "testV" */
/**
 * alwaysShow: true/false       是否展示根菜单，不根据子菜单的长度去判断是否显示，默认false
 * hidden: true/false          是否隐藏菜单，默认fasle
 * redirect: 'noredirect'      在面包屑中点击不进行跳转
 * name: 'route-name'          用于<keep-alive>组件中，如果要缓存必须配置当前选项，name名为组件中的name名
 * meta: {
 *     title: 'title'          菜单、面包屑、tabs中显示的名称
 *     icon: 'icon'            菜单中显示的图标
 *     noCache: true/false     是否不缓存当前路由，默认false
 *     storeName: 'vuex-name'  关闭或刷新当前路由时，是否清除对应的vuex数据，如果清除请配置vuex名，并在对应vuex中的mutations中增加CLEAR_DATA方法
 * }
 */
const routeConfigJson = require('../route.config.json');
const routeConfigArr = Object.keys(routeConfigJson).map((key) => {
    return routeConfigJson[key];
})
const routes = [
    {
        path: '/',
        component: LayoutDefault,
        redirect: '/description',
        name: 'demo',
        children: [
            {
                path: 'description',
                component: () => import('@/../README.md'),
                name: 'Description',
                meta: {
                    title: '说明',
                    icon: 'dashboard'
                }
            }
        ]
    },
    {
        path: '/testV',
        component: LayoutDefault,
        name: 'demo',
        children: [
            {
                path: 'testV',
                component: () => import('@demo/pages/demo/testV/TestV'),
                name: 'TestV',
                meta: {
                    title: '调试页',
                    icon: 'dashboard'
                }
            }
        ]
    }
];
function parseRoute(routesPar, routeConfigArrPar) {
    for(let i = 0; i < routeConfigArrPar.length; i++) {
        let item = routeConfigArrPar[i];
        let routeOne = {
            path: item.path,
            component: item.root ? LayoutDefault : (item.componentPath ? () => import(`@docs/zh-CN${item.componentPath}`) : ''),
            redirect: item.redirect ? item.redirect : false,
            name: item.name
        }
        if(item.meta) routeOne.meta = item.meta;
        item.children = item.children || []
        if(item.root && !item.children.length) continue;
        routesPar.push(routeOne);
        if(!item.children.length) continue;
        routeOne.children = [];
        parseRoute(routeOne.children, item.children)
    }
}
parseRoute(routes, routeConfigArr);
console.log('routes', routes);
// const routes = [
//     {
//         path: '/',
//         component: LayoutDefault,
//         redirect: '/testV',
//         name: 'demo1',
//         children: [
//             {
//                 path: 'testV',
//                 component: () => import('@demo/pages/demo/testV/TestV'),
//                 name: 'TestV',
//                 meta: {
//                     title: '测试页',
//                     icon: 'dashboard'
//                 }
//             }
//         ]
//     },
//     {
//         path: '/demo',
//         component: LayoutDefault,
//         name: 'demo2',
//         children: [
//             {
//                 path: 'testV2',
//                 /* webpackChunkName: "testV" */
//                 component: () => import('@demo/pages/demo/testV/testV2'),
//                 name: 'testV2',
//                 meta: {
//                     title: '测试页',
//                     icon: 'dashboard'
//                 }
//             }
//         ]
//     }
// ]

let router = new VueRouter({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: routes
})

export {
    routes
}

export default router