import Vue from 'vue';
import STCUI from '@/index.js';
Vue.use(STCUI);

let id = 0;

const createElm = function() {
    const elm = document.createElement('div');
    elm.id = 'app' + ++id;
    document.body.appendChild(elm);
    return elm;
};

/**
 * 回收 vm
 * @param {*} vm
 */
export const destroyVM = function(vm) {
    vm.$destroy && vm.$destroy();
    vm.$el &&
    vm.$el.parentNode &&
    vm.$el.parentNode.removeChild(vm.$el);
}

/**
 * 创建一个Vue的实例对象
 * @param {*} Compo 组件配置，可直接传template
 * @param {*} mounted 是否添加到DOM上
 * @return {*} vm
 */
export const createVue = function(Compo, mounted = false) {
    if(Object.prototype.toString.call(Compo) === '[object String]') {
        Compo = { template: Compo };
    }
    return new Vue(Compo).$mount(mounted === false ? null : createElm());
}

/**
 * 创建一个测试组件实例
 * @link http://vuejs.org/guide/unit-testing.html#Writing-Testable-Components
 * @param {*} Compo 组件对象
 * @param {*} propsData props数据
 * @param {*} mounted 是否添加到DOM上
 * @return {*} vm
 */
export const createTest = function(Compo, propsData = {}, mounted = false) {
    if(propsData === true || propsData === false) {
        mounted = propsData;
        propsData = {};
    }
    const elm = createElm();
    const Ctor = Vue.extend(Compo);
    return new Ctor({ propsData }).$mount(mounted === false ? null : elm);
}
/**
 * 触发一个事件
 * mouseenter, mouseleave, mouseover, keyup, change, click 等
 * @link https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createEvent
 * @link https://developer.mozilla.org/zh-CN/docs/Web/API/Event/initEvent
 * @param {*} elm 触发的元素
 * @param {*} name 事件名称
 * @param {*} opts event选项
 */
export const triggerEvent = function(elm, name, opts = {}) {
    /**
     * "bubbles"，可选，Boolean类型，默认值为 false，表示该事件是否冒泡。
     * "cancelable"，可选，Boolean类型，默认值为 false， 表示该事件能否被取消。
     * "composed"，可选，Boolean类型，默认值为 false，指示事件是否会在影子DOM根节点之外触发侦听器。
     */
    const evt = new Event(name, opts);
    elm.dispatchEvent ? elm.dispatchEvent(evt) : elm.fireEvent('on' + name, evt);
    return elm;
}

/**
 * 触发 “mouseup” 和 “mousedown” 事件
 * @param {*} elm
 * @param {*} opts
 */
export const triggerMouse = function(elm, opts) {
    triggerEvent(elm, 'mousedown', opts);
    triggerEvent(elm, 'mouseup', opts);
    return elm;
}

/**
 * 触发keydown事件
 * @param {*} el
 * @param {*} keyCode
 */
export const triggerKeyDown = function(el, keyCode) {
    const evt = new Event('keydown', { bubbles: true, cancelable: true });
    evt.keyCode = keyCode;
    el.dispatchEvent(evt);
}

/**
 * 间隔多少秒返回Promise
 * @param {*} ms
 */
export const wait = function(ms = 50) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

/**
 * 等待一个 Tick，代替 Vue.nextTick，返回 Promise
 */
export const waitImmediate = () => wait(0);