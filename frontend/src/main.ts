import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './locales/i18n'
import { initYandexMetrika } from './utils/analytics'
import './style.css'

initYandexMetrika()

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
