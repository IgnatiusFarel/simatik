import './style.css'
import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'

const app = createApp(App)
const pinia = createPinia() 
const head = createHead()

app.use(router)
app.use(head)
app.use(pinia)
app.mount('#app')