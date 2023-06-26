import AppVue from '@/App.vue'
import AuthVue from '@/components/Auth.vue'
import HomeVue from '@/components/Home.vue'
import LoginVue from '@/components/Login.vue'
import RegisterVue from '@/components/Register.vue'
import ProfileVue from '@/components/Profile.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useGlobalStore } from '@/stores/GlobalStore'
import StartGameVue from '@/components/StartGame.vue'
import GameVue from '@/components/Game.vue'
import GameBotVue from '@/components/GameBot.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeVue
    },
    {
      path: '/play/bot/:id',
      name: 'bot',
      component: GameVue,
      props: true 
    },
    {
      path: '/play/player/:id',
      name: 'player',
      component: GameVue,
      props: true 
    },
    {
      path: '/play/find',
      name: 'play',
      component: StartGameVue
    },
    {
      path: '/login',
      name: 'login',
      component: LoginVue
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterVue
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileVue
    },

  ]
})

export default router
