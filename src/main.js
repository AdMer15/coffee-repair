import { createApp } from 'vue'
import { createPinia } from 'pinia' // Neu hinzugefügt
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './style.css'

const app = createApp(App)

app.use(createPinia()) // Neu hinzugefügt
app.use(router)
app.use(i18n)
app.use(Toast, {
  position: 'top-right',
  timeout: 4000,
  closeOnClick: true,
  pauseOnHover: true
})

app.mount('#app')