import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resources from '../../../locales'

class I18n {
  init (store) {
    const RTL_LANGUAGES = ['ar', 'fa']

    i18n
      .use(LanguageDetector)
      .init({
        resources: resources,
        fallbackLng: 'en',
        ns: ['common', 'errors', 'Location', 'Search', 'Footer'],
        defaultNS: 'common',
        load: 'languageOnly',
        // eslint-disable-next-line no-undef
        debug: __DEV__
      })

    // Set app language to primary language of i18next
    // store.dispatch(setLanguage(i18n.languages[0])) // fixme

    function handleLanguageChange () {
      const state = store.getState()

      let lang = i18n.languages[0]  // Use language from browser detection if it is not available in url
                                    // todo: redirect to correct url

      if (state.router.params) {
        lang = state.router.params.language
      }

      // Handle ltr/rtl
      if (RTL_LANGUAGES.includes(lang)) {
        document.body.style.direction = 'rtl'
      } else {
        document.body.style.direction = 'ltr'
      }
      // Set i18n language to apps language
      i18n.changeLanguage(lang)
    }

    store.subscribe(handleLanguageChange)
  }

  /**
   * @returns Gets reactnext i18n
   */
  get i18next () {
    return i18n
  }
}

export default I18n
