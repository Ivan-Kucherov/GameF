<script>
import { ref } from 'vue'
import { useGlobalStore } from '../stores/GlobalStore'
import router from '../router/index'

export default {
  setup() {
    // expose to template and other options API hooks
    const site_ = useGlobalStore()
    const all = ref()
    const wins = ref()
    axios({
      method: 'get',
      url: `/game/player/${site_.site.username}/`
    })
      .then((response) => {
        all.value = response.data.all
        wins.value = response.data.wins
      })
      .catch(function (error) {
        console.log(error)
        ReqestMessage(message, error)
      })
    return {
      site_,
      all,
      wins
    }
  },
  methods: {
    LogOut() {
      this.site_.LogOut()
      localStorage.removeItem('tokens')
      localStorage.removeItem('game')
      router.push('/')
    }
  },
  mounted() {}
}
</script>

<template>
  <div class="stats text">
    <div>Всего игр:{{all}}</div>
    <div>Выиграно:{{wins}}</div>
    <n-button @click="LogOut()" type="error">Выход</n-button>
  </div>
</template>

<style scoped>
.stats {
  display: flex;
  flex-direction: column;
  position: relative;
  margin-left: 2em;
  margin-right: auto;
  margin-top: 1em;
  width: 12em;
}
.text {
  font-size:1.2em
}
</style>