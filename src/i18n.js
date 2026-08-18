import { createI18n } from 'vue-i18n'
import de from './locales/de.json'
import en from './locales/en.json'
import bs from './locales/bs.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'de',
  messages: { de, en, bs }
})

export default i18n
