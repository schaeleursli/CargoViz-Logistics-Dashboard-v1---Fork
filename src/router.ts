import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/auth/Login.vue'
import Home from './components/Home.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Home },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
