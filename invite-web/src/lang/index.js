import enLocale from './en'
import zhLocale from './zh'

import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'

Vue.use(VueI18n)

const messages = {
    en: {
        ...enLocale,
        // ...ELEMENT.lang.en
    },
    zh: {
        ...zhLocale,
        // ...ELEMENT.lang.zh
    }
}
/* eslint-disable */
const i18n = new VueI18n({
    locale:(Cookies.get('lang') && typeof Cookies.get('lang') === 'string' ? Cookies.get('lang').toLowerCase() : '') || 'zh',
    messages,
    silentTranslationWarn: true
})
/* eslint-enable */
// ElementLocale.i18n((key, value) => i18n.t(key, value))
export default i18n