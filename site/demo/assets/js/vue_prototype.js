import Vue from 'vue';
Vue.use({
    install(Vue) {
        Vue.prototype.$namespace = 'stc';
    }
})