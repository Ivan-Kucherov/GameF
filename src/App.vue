<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
//import Header from'./components/Header.vue'
import Footer from './components/Footer.vue'
import Game from './components/GameBot.vue'
import Auth from './components/Auth.vue'
import Register_ from './components/Register.vue'
import Login_ from './components/Login.vue'
import User_ from './components/Profile.vue'
import Home_ from './components/Home.vue'
import {
  h,
  defineComponent,
  ref,
  type Component,
  reactive,
  shallowRef,
  computed,
  watch,
  Ref
} from 'vue'
import { MenuOption, NIcon } from 'naive-ui'
import {
  BookOutline as BookIcon,
  CogOutline,
  Dice,
  PersonOutline as PersonIcon,
  Play,
  StatsChart,
  WineOutline as WineIcon,
  HomeOutline,
  Home
} from '@vicons/ionicons5'
import { useGlobalStore } from './stores/GlobalStore'
import { useGameStore } from './stores/GameStore'
//import { log } from 'console'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
const obj_ = useGlobalStore()
const game_ = useGameStore()
const id_ = ref(game_.game.id)
const obj = computed(() => obj_.site).value
console.log("--",id_)
if (id_ == undefined){
  game_.$reset()
}
const menuOptions: MenuOption[] = reactive([
  {
    label: () =>
      h(
        RouterLink,
        {
            to: {
              name: 'play',
              params: {}
            }
        },
        { default: () => 'Играть' }
      ),
    key: 'playButton',
    icon: renderIcon(Dice),
    disabled: false,
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'bot',
                params: {id:0}
              }
            },
            { default: () => 'Компьютер' }
          ),
        key: 'bot',
        show: false,
        icon: renderIcon(CogOutline)
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'player',
                params: {id:(String(id_.value) !== "")? String(id_.value) : 0 }
              }
            },
            { default: () => 'Онлайн' }
          ),
        key: 'player',
        show: String(id_.value) !== "",
        icon: renderIcon(Play)
      }
    ]
  },
  {
    label: 'Stat',
    key: 'stat',
    show: false,
    icon: renderIcon(StatsChart),
    disabled: true,
    children: []
  }
])
const BtnColor = ref('')
const BkgColor = ref('')
if (obj.inv) {
  BtnColor.value = '#b7b7b7'
  BkgColor.value = '#b7b7b7'
} else {
  BtnColor.value = '#151515'
  BkgColor.value = '#252525'
}
watch(obj_, (newValue, oldValue) => {
  if (newValue.site.inv) {
    BtnColor.value = '#b7b7b7'
    BkgColor.value = '#b7b7b7'
  } else {
    BtnColor.value = '#151515'
    BkgColor.value = '#252525'
  }
})

/*
function Log() 
  {
    console.log("LOG")
  }
function Login() 
  {
    if (localStorage.getItem("tokens"))
    {
      obj.comp = User_;
    } else
    obj.comp = Login_
  }
function Register() 
  {
    obj.comp = Register_
  }
function GoHame() 
  {
    obj.comp = Home_
  }
function atest() {
  if (localStorage.getItem("tokens"))
  {
    obj.username = localStorage.getItem("user")
    return false;
  }
  return true
}
*/
</script>

<template>
  <n-space vertical v-bind:class="{ space: true, day: !obj.inv, night: obj.inv }">
    <n-layout-header :inverted="obj.inv" bordered>
      <router-link :to="{ name: 'home' }">
        <n-button text :color="BtnColor" style="margin-left: 1%; margin-right: 1%"> FigureForm </n-button>
      </router-link>

      <n-menu mode="horizontal" :inverted="obj.inv" :options="menuOptions" />
      <router-link :to="obj.username ? { name: 'profile' } : { name: 'login' }">
        <n-button
          text
          :color="BtnColor"
          style="
            right: 1em;
            position: absolute;
            margin-left: 1em;
            margin-right: 1em;
            margin-top: 1em;
          "
        >
          {{ obj.username ? obj.username : 'Вход' }}
        </n-button>
      </router-link>
      <router-link :to="{ name: 'register' }">
        <n-button
          :color="BtnColor"
          v-if="!obj.username"
          text
          style="
            right: 5em;
            position: absolute;
            margin-left: 1%;
            margin-right: 1em;
            margin-top: 1em;
          "
        >
          Регистрация
        </n-button>
      </router-link>
    </n-layout-header>
    <n-message-provider>
      <router-view></router-view>
      <!--
      <component v-bind:is="obj.comp" :inverted="inv" />
      -->
    </n-message-provider>
    <Footer></Footer>
  </n-space>
</template>
<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
.space {
  height: 100%;
}
.day{
  background: #5155a6;
  color: #89d9d1;
}
.night{
  background: #022623;
  color: #bf8665;
}
</style>