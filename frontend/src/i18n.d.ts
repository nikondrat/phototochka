import { MessageSchema } from './locales/i18n';

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: string) => string; // This is a simplified version, vue-i18n has its own types
  }
}

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
}
