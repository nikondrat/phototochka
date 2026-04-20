import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initYandexMetrika } from './utils/analytics'
import './style.css'

initYandexMetrika()

createApp(App).use(router).mount('#app')
