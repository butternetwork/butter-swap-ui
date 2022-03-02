import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);
import messages from './messages';

const i18n = new VueI18n({
    locale: 'en', // 设置地区
    messages, // 设置地区信息
})

export default i18n;
