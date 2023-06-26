import './.assets/main.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'
import { computed, createApp} from 'vue'
import { createPinia } from 'pinia'
//import naive from 'naive-ui'
import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import App from './App.vue'
import configs from '../config.json'
import router from "./router/index"
import axiosRetry from 'axios-retry';
import piniaPluginPersistedState from "pinia-plugin-persistedstate"
import { useGlobalStore } from "./stores/GlobalStore"
// Create a new store instance.
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)


axios.defaults.baseURL = configs.server
if (localStorage.getItem("tokens")) {
    axios.defaults.headers.common['Authorization'] = "Bearer "+ JSON.parse(localStorage.tokens).access;
}

axios.defaults.headers.post['Content-Type'] = 'application/json';
function getAccessToken() {
    let tokens = localStorage.getItem("tokens")
    if (tokens) {
        return JSON.parse(tokens).access;
    }
    return null
}
axios.interceptors.request.use((request) => {
    let token = getAccessToken();
    if (token !== null)
        request.headers['Authorization'] = "Bearer "+ token;
    else
    request.headers['Authorization'] = null;
    //console.log(JSON.stringify(request));
    return request;
});
axiosRetry(axios, { retries: 1 });
// Function that will be called to refresh authorization
const refreshAuthLogic = (failedRequest:Request) =>{
    axios.defaults.headers.common['Authorization'] = null;
    return axios.post('/game/refresh/',{"refresh":JSON.parse(localStorage.tokens).refresh}).then((tokenRefreshResponse) => {
        const result = JSON.stringify(tokenRefreshResponse.data, null, 2);
        localStorage.tokens = result
        axios.defaults.headers.common['Authorization'] = "Bearer "+ tokenRefreshResponse.data.access;
    });

}
// Instantiate the interceptor
createAuthRefreshInterceptor(axios, refreshAuthLogic);


// Use interceptor to inject the token to requests



const app = createApp(App)
app.config.globalProperties.inv = false //
//app.use(naive)
app.use(pinia)
app.use(router)
const site_= useGlobalStore()
const site = computed(()=>site_.site)
router.beforeEach((to, from) => {
  if (to.name == 'bot' && site_.site.username == null) 
  {
    return {path:'login'}
  }
  if (to.name == 'bot'  && !site_.site.GameStarted) 
  {
    return {path:'play'}
  }
  return true
})
router.beforeEach((to, from) => {
  if (to.name == 'player' && site_.site.username == null) 
  {
    return {path:'login'}
  }
  if (to.name == 'player' && !site_.site.GameStarted) 
  {
    return {path:'play'}
  }
  
  return true
})

router.beforeEach((to, from) => {
  if (to.name == 'play' && (site_.site.username == null)) 
  {
    return {path:'login'}
  }
  return true
})
router.beforeEach((to, from) => {
  if (to.name == 'profile' && site_.site.username == null) 
  {
    return {path:'login'}
  }
  return true
})


app.mount('#app')
