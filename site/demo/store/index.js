import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import getters from '@demo/store/getters';
import sideBar from '@demo/store/modules/sideBar';
import tagsView from '@demo/store/modules/tagsView';

export default new Vuex.Store({
    state: {
        language: sessionStorage.getItem('lang') || 'zh',
        LANG: {
            'zh': '简体中文',
            'en': 'English'
        }
    },
    getters,
    mutations: {
        SET_LANGUAGE(state, val) {
            state.language = val;
        }
    },
    actions: {},
    modules: {
        sideBar,
        tagsView
    }
})