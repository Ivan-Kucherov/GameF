import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
export const useGlobalStore = defineStore('site',{
    // arrow function recommended for full type inference
    state: () => ({
      site:reactive({
                    inv:false,
                    username:null,
                    GameStarted:false,
                    })
              
    }),
    actions: {
      SetUsername(name:String) {
        this.site.username = name
      },
      LogOut(){
        this.site.username = null
      },
      Inverse(){
        this.site.inv = !this.site.inv
      }
    },
    persist: true
})
//export default {useGlobalStore}