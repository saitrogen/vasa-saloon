import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuth } from './stores/auth'
import './assets/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Initialize the auth store and check session before mounting the app
const authStore = useAuth()
await authStore.checkAuth()

app.use(router)

app.mount('#app')
