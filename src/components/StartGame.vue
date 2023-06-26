<script>
import { ref } from 'vue'
import { useGlobalStore } from '../stores/GlobalStore'
import { CogOutline } from '@vicons/ionicons5'
import router from '../router/index'
import { useMessage } from 'naive-ui'
import { useGameStore } from '../stores/GameStore'

export default {
  setup() {
    const loadingRef = ref(false)
    const DisableRef = ref(true)
    const confirming = ref(false)
    const Message = ref()
    const type = ref('player')
    const site_ = useGlobalStore()
    const game_ = useGameStore()
    const site = computed(() => site_.site)
    const message = useMessage()
    const inter = ref(null)
    // expose to template and other options API hooks
    const options = [
      {
        label: 'Компьютер',
        key: 'bot',
        disabled: true
      },
      {
        label: 'Онлайн',
        key: 'player'
      }
    ]
    const connection_ = ref(new WebSocket('ws://192.168.1.6:8000/ws/find'))
    function toTimeString(seconds) {
      return new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0]
    }
    function Connect(connection) {
      connection.onmessage = function (event) {
        if (event.data == 'Invalid Token') {
          axios({
            method: 'get',
            url: '/game/atest/'
          })
            .then((response) => {
              connection.send(
                `{ "_type": "token", "token": "${JSON.parse(localStorage.tokens).access}"}`
              )
            })
            .catch(function (error) {
              ReqestMessage(message, error)
            })
        } else if (event.data == 'access') {
          connection.send(JSON.stringify({ _type: 'start' }))
        } else {
          let data = JSON.parse(event.data)
          if (data._type == 'confirmed') {
            Message.value = JSON.stringify(data)
            console.log()
            confirming.value = true
          }
          if (data._type == 'created') {
            site_.site.GameStarted = true
            //router.push({ name: type.value, params: { id: data.code } })
            game_.game.id = data.code
            inter.value = 1
            router.replace(`/play/${type.value}/${data.code}`)
            console.log(`started ${data.code}`)
          }
          if (data._type == 'ban') {
            message.error('Осталось до разблокировки:' + toTimeString(data.time))
            console.log(`banned`)
            loadingRef.value = false
          }
        }
      }
      connection.onopen = function (event) {
        console.log(event)
        console.log('Successfully connected to the echo websocket server...')
        if (inter.value !== null) {
          clearInterval(inter.value)
          connection_.value = connection
          message.success('Восстановлено')
        }
        DisableRef.value = false
      }
      connection.onclose = function (event) {
        console.log(event)
        console.log('close')
        if (inter.value == null) {
          DisableRef.value = true
          inter.value = setInterval(() => {
            message.error('Потеряно соендинение с сервером')
            connection = new WebSocket(`ws://192.168.1.6:8000/ws/find`)
            Connect(connection)
          }, 3000)
        }
      }
      connection.onerror = function (event) {
        console.log(event)
        console.log('error')
      }
    }
    Connect(connection_.value)
    function handleSelect(key) {
      type.value = key
      //message.success(`play/${type.value}/${''}`)
    }
    function StartSearch() {
      loadingRef.value = true
      connection.value.send('/ws/find')
      try {
      } catch (e) {}
    }
    return {
      options,
      site,
      StartSearch,
      handleSelect,
      loading: loadingRef,
      disabled: DisableRef,
      type,
      Connection: connection_,
      Message,
      confirming,
      message,
      inter
    }
  },
  methods: {
    Start() {
      console.log(this)
      this.Connection.send(
        `{ "_type": "token", "token": "${JSON.parse(localStorage.tokens).access}"}`
      )
      this.loading = true
    },
    Confirm() {
      console.log(this.connection)
      this.Connection.send(this.Message)
      this.confirming = false
    }
  },
  mounted() {
    console.log(this.count) // 0 <iframe src="https://giphy.com/embed/xGrjBxxEBvWTBtkAk4" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/blue-winter-boreal-xGrjBxxEBvWTBtkAk4">via GIPHY</a></p>
    this.inter = null
  }
  ,unmounted()  {
    clearInterval(this.inter)
    this.inter = 1
  }
}
</script>

<template >
  <n-space vertical>
    <div>
      <div id="parent">
        <div v-if="!this.confirming" id="form">
          <div>
            <n-button
              ghost
              color="#9dff6f"
              style="width: 16em; height: 8em; margin: 2em"
              @click="Start()"
              :loading="loading"
              :disabled="disabled"
              >{{ 'Искать' }}</n-button
            >
            <n-dropdown
              :inverted="site.inv"
              trigger="hover"
              :options="options"
              @select="handleSelect"
            >
              <div>
                <div id="icon">
                  <transition name="fade">
                    <span v-if="type == 'player'"
                      ><ion-icon size="large" name="play-outline"></ion-icon>
                      <div>Игрок</div></span
                    >
                  </transition>
                  <transition name="fade">
                    <span v-if="type == 'bot'"
                      ><ion-icon size="large" name="cog-outline"></ion-icon>
                      <div>Бот</div></span
                    >
                  </transition>
                </div>
              </div>
            </n-dropdown>
          </div>
        </div>
        <div v-if="this.confirming" id="form">
          <n-button
            color="#9dff6f"
            style="width: 16em; height: 16em; margin-left: auto; margin-right: auto"
            @click="Confirm()"
            >Принять
          </n-button>
        </div>
      </div>
    </div>
  </n-space>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
span {
  position: relative;
  transition: 1s;
  user-select: none;
}

span:before {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  content: attr(data-replace);
  color: transparent;
  transition: 1s;
}

#parent {
  width: 100%;
  height: 100%;
}
#form {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 24em;
  height: 20em;
  top: 20%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  vertical-align: middle;
  background-color: rgba(45, 243, 243, 0.582);
  border-radius: 12px;
  border: 5px solid rgba(255, 184, 52, 0.125);
}
#icon {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 5em;
  height: 5em;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  vertical-align: middle;
  background-color: #0000007a;
  border-radius: 1em;
  border: 5px solid rgba(39, 36, 221, 0.644);
}

.animation_gradient {
  background: linear-gradient(-45deg, #00ffbf, #0a67a5, #00cc2c, #5ed3b8, #3639ee, #0a67a5a4);
  background-size: 400% 100%;
  height: 100vh;
  animation: gradient 10s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

