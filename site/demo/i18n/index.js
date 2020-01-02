import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

// element-ui的i18n
// import ElementLocale from 'element-ui/lib/locale';
// import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
// import enLocale from 'element-ui/lib/locale/lang/en';

// 本地的i18n
import zh from '@demo/i18n/locales/zh';
import en from '@demo/i18n/locales/en';

const messages = {
    zh: Object.assign(zh, {}),
    en: Object.assign(en, {})
}

const i18n = new VueI18n({
    fallbackLocale: 'zh',
    locale: 'zh',
    messages
})

// element-ui
// ElementLocale.i18n((key, value) => i18n.t(key, value));

export default i18n;