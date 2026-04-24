import { createI18n } from 'vue-i18n';
import ru from './ru';
import en from './en';

export type MessageSchema = typeof ru;

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('ft_lang') || 'ru',
  fallbackLocale: 'ru',
  messages: {
    ru,
    en: en as any,
  },
});

export default i18n;
