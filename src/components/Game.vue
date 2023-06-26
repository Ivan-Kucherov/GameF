<script>
import { ref, reactive, computed, toRaw, shallowRef, watch } from 'vue'
import { EllipseOutline } from '@vicons/ionicons5'
import configs from '../../config.json'
import axios, { AxiosError } from 'axios'
import { useMessage } from 'naive-ui'
//import { ifError } from 'assert'
import { useGameStore } from '@/stores/GameStore'
import { useRoute } from 'vue-router'
import router from '../router/index'
import { useGlobalStore } from '../stores/GlobalStore'

/**
 *@typedef {any} NewType
 */

export default {
  setup() {
    //const points = ref(Array())
    const route = useRoute()
    const id = route.params.id
    const message = useMessage()
    const game_ = useGameStore()
    const connection_ = shallowRef()
    const points = ref(Array())
    const game = game_.game
    const ready = ref(true)
    const site = useGlobalStore()
    const win = ref(null)
    const showModal = ref(false)
    const inter = ref(null)
    const DrawText = ref('Выделить фигуру')
    game.started = true
    game.draw = false
    game.view = new Array(16)
    for (let index = 0; index < game.view.length; index++) {
      game.view[index] = new Array(16)
      for (let index2 = 0; index2 < game.view[index].length; index2++) {
        game.view[index][index2] = false
      }
    }

    connection_.value = new WebSocket(`ws://192.168.1.6:8000/ws/game/${id}`)
    function Events(connection) {
      connection.onopen = function (event) {
        if (inter.value !== null) {
          connection_.value = connection
          message.success('Восстановлено')
          clearInterval(inter.value)
          inter.value = null
        }
        console.log(event)
        console.log('Successfully connected to the echo websocket server...')
        connection.send(`{ "_type": "token", "token": "${JSON.parse(localStorage.tokens).access}"}`)
      }
      connection.onmessage = function (event) {
        if (event.data == 'Invalid Token' && tok) {
          axios({
            method: 'get',
            url: '/game/atest/'
          })
            .then((response) => {
              connection.send(
                `{ "_type": "token", "token": "${JSON.parse(localStorage.tokens).access}"}`
              )
              tok = false
            })
            .catch(function (error) {
              ReqestMessage(message, error)
            })
        } else if (event.data == 'access') {
          connection.send(JSON.stringify({ _type: 'player' }))
        } else {
          let data = JSON.parse(event.data)
          if (data !== undefined) {
            game.started = true
            if (data._type == 'data') {
              game.draw = false
              this.DrawText = 'Выделить фигуру'
              game.map = data.map
              game.player0 = data.player0
              game.player1 = data.player1
              game.started = true
              game.user0 = data.user0
              game.user1 = data.user1
              game.score = data.score
            }
            if (data._type == 'moved') {
              if (data.move == site.site.username) {
                if (!game.Spect) {
                  ready.value = true
                } else {
                  ready.value = false
                }
              }
              game.score = data.score
              game.draw = false
              points.value = Array()
              game.map = data.map
              game.player0 = data.player0
              game.player1 = data.player1
            }
            if (data._type == 'drawed') {
              ready.value = false
              game.draw = false
              this.DrawText = 'Выделить фигуру'
              points.value = Array()
              game.map = data.map
              game.player0 = data.player0
              game.player1 = data.player1
            }
            if (data._type == 'badDraw') {
              message.warning('Закрашено неверно')
              ready.value = true
              game.draw = false
              this.DrawText = 'Выделить фигуру'
              for (let index = 0; index < game.view.length; index++) {
                for (let index2 = 0; index2 < game.view[index].length; index2++) {
                  game.view[index][index2] = false
                }
              }
              points.value = Array()
              game.map = data.map
              game.player0 = data.player0
              game.player1 = data.player1
            }
            if (data._type == 'badMove') {
              ready.value = true
              game.draw = false
              this.DrawText = 'Выделить фигуру'
              for (let index = 0; index < game.view.length; index++) {
                for (let index2 = 0; index2 < game.view[index].length; index2++) {
                  game.view[index][index2] = false
                }
              }
              points.value = Array()
              game.map = data.map
              game.player0 = data.player0
              game.player1 = data.player1
            }
            if (data._type == 'player') {
              game.map = data.map
              game.player0 = data.player0
              game.player1 = data.player1
              game.started = true
              game.user0 = data.user0
              game.user1 = data.user1
              game.Spect = false
              game.isOne = data.isOne
              ready.value = data.move
              game.score = data.score
            }
            if (data._type == 'spect') {
              game.map = data.map
              game.player0 = data.player0
              game.player1 = data.player1
              game.started = true
              game.user0 = data.user0
              game.user1 = data.user1
              game.score = data.score
              //console.log(JSON.parse(game.map))
            }
            if (data._type == 'End') {
              game.map = data.map
              game.player0 = data.player0
              game.player1 = data.player1
              game.score = data.score
              win.value = data.win
              showModal.value = true
              setTimeout(() => {
                game.started = false
                game.id = ''
                router.replace('/play/find')
              }, 30000)
              //console.log(JSON.parse(game.map))
            }
          }
        }
      }
      connection.onclose = function (event) {
        console.log(event)
        message.error('Потеряно соендинение с сервером')
        console.log('close')
        if (inter.value == null) {
          inter.value = setInterval(() => {
            message.error('Потеряно соендинение с сервером')
            connection = new WebSocket(`ws://192.168.1.6:8000/ws/game/${id}`)
            Events(connection)
          }, 5000)
        }
      }
      connection.onerror = function (event) {
        console.log(event)
        console.log('error')
      }
    }
    var tok = true
    Events(connection_.value)
    //console.log(w, h)
    return {
      game,
      message,
      connection: connection_,
      id,
      ready,
      points,
      w: ref(0),
      h: ref(0),
      DrawText,
      showModal,
      win,
      inter
    }
  },
  methods: {
    myEventHandler(e) {
      // your code for handling resize...
      this.w = this.$refs.box.offsetWidth / 16
      this.h = this.$refs.box.offsetHeight / 16
      console.log(this.w, this.h)
    },
    Chose(item, index1, index2) {
      var player = -1
      if (!this.game.Spect) {
        if (this.ready) {
          if (this.game.isOne) {
            player = 0
          } else {
            player = 1
          }
          if (player == 0) {
            var Player = this.game.player0
          } else {
            var Player = this.game.player1
          }
          if (!this.game.draw) {
            if (item[player]) {
              this.game.chosen = true
              this.SqrSet([index1, index2], true)
              console.log('SqrSet', [index1, index2], item[player])
            } else if (
              this.game.chosen &&
              Math.abs(index1 - Player[0]) < 2 &&
              Math.abs(index2 - Player[1]) < 2
            ) {
              this.SqrMove(Player, [index1, index2])
              this.game.player0 = [index1, index2]
              this.game.player1 = [index1, index2]
              console.log('4')
              this.connection.send(`{"_type":"move","pos":"${[index1, index2]}"}`)
              this.ready = false
              //item[0] = true
              //this.game.map[player[0]][player[1]][player] = false
            }
          } else if (this.points.length < 5) {
            console.log(this.w, this.h)
            if (
              item[player + 2] &&
              (this.points.length < 3 ||
                (this.points.length !== 0 &&
                  !(this.points[0][0] == index1 && this.points[0][1] == index2)))
            ) {
              this.points.push([index1, index2])
            } else if (
              this.points.length > 2 &&
              item[player + 2] &&
              this.points[0][0] == index1 &&
              this.points[0][1] == index2
            ) {
              this.connection.send(`{"_type":"draw","points":"${JSON.stringify(this.points)}"}`)
              this.points.push([index1, index2])
              this.game.draw = false
              this.DrawText = 'Выделить фигуру'
            }
            console.log(toRaw(this.points[0]) == [index1, index2], toRaw(this.points)[0], [
              index1,
              index2
            ])
          } else {
            this.points = Array()
            this.game.draw = false
            this.DrawText = 'Выделить фигуру'
          }
        } else {
          this.message.warning('Не ваш ход')
        }
      }
    },
    SqrSet(pos, value) {
      try {
        this.game.view[pos[0] + 1][pos[1]] = value
      } catch (e) {}
      try {
        this.game.view[pos[0] + 1][pos[1] + 1] = value
      } catch (e) {}
      try {
        this.game.view[pos[0]][pos[1] + 1] = value
      } catch (e) {}
      try {
        this.game.view[pos[0] - 1][pos[1] + 1] = value
      } catch (e) {}
      try {
        this.game.view[pos[0] - 1][pos[1]] = value
      } catch (e) {}
      try {
        this.game.view[pos[0] - 1][pos[1] - 1] = value
      } catch (e) {}
      try {
        this.game.view[pos[0]][pos[1] - 1] = value
      } catch (e) {}
      try {
        this.game.view[pos[0] + 1][pos[1] - 1] = value
      } catch (e) {}
    },
    SqrMove(pos1, pos2) {
      this.SqrSet(pos1, false)
      this.SqrSet(pos2, true)
    },
    Log(item) {
      console.log('dis1')
    },
    draw() {
      for (let index = 0; index < this.game.view.length; index++) {
        for (let index2 = 0; index2 < this.game.view[index].length; index2++) {
          this.game.view[index][index2] = false
        }
      }
      this.game.chosen = false
      this.points = Array()
      this.game.draw = !this.game.draw
      if (this.game.draw) {
        this.DrawText = 'Прекратить выделение'
      } else {
        this.DrawText = 'Выделить фигуру'
      }
    }
  },
  mounted() {
    this.w = this.$refs.box.offsetWidth / 16
    this.h = this.$refs.box.offsetHeight / 16
    this.inter = null
  },
  created() {
    window.addEventListener('resize', this.myEventHandler)

    /*console.log('Starting connection to WebSocket Server')
    this.connection = new WebSocket('ws://192.168.1.6:8000/ws/live-score/1/')

    this.connection.onmessage = function (event) {
      console.log(event)
    }

    this.connection.onopen = function (event) {
      console.log(event)
      console.log('Successfully connected to the echo websocket server...')
    }
    return {connection}*/
  },
  unmounted()
  {
    window.removeEventListener('resize', this.myEventHandler)
    clearInterval(this.inter)
    this.inter = 1
  },
}

/*
const game = reactive({
  started:false,
  map:Array,
  view:Array,
  chosen:false,
  player1:Array,
  }
  )


  */
</script>

<template>
  <n-modal :show="showModal">
    <n-card
      style="width: 85vw; height: 85vh"
      title="Конец игры"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <a style="font-size: 5vw;">Выиграл:{{ win }}</a>
    </n-card>
  </n-modal>
  <div ref="box" v-if="game.started" class="box">
    <svg
      style="
        position: absolute;
        pointer-events: none;
        max-height: 78vw;
        max-width: 78vw;
        width: 100%;
        height: 100%;
      "
    >
      <g v-if="points.length > 0" :key="[w, h]">
        <line
          v-for="(n, i) in points.length - 1"
          :x1="w * (points[i][1] + 0.5)"
          :y1="w * (points[i][0] + 0.5)"
          :x2="w * (points[i + 1][1] + 0.5)"
          :y2="w * (points[i + 1][0] + 0.5)"
          style="stroke: rgb(0, 255, 221); stroke-width: 5"
          v-bind:key="i"
        />
      </g>
      <circle
        v-for="point in points"
        :cx="w * (point[1] + 0.5)"
        :cy="w * (point[0] + 0.5)"
        r="5"
        v-bind:key="point"
        style="stroke: rgb(0, 255, 221); stroke-width: 5"
      />
    </svg>
    <n-grid v-for="[index1, dis1] of game.map.entries()" :cols="16" x-gap="0" v-bind:key="dis1">
      <n-gi v-for="[index2, item] of dis1.entries()" v-bind:key="item">
        <div v-bind:class="{ nend: !item[4], end: item[4], light_blue: game.view[index1][index2] }">
          <div
            v-bind:class="{ p1: item[2], p2: item[3], light_green: !(item[2] || item[3]) }"
            @click="Chose(item, index1, index2)"
          >
            <ion-icon name="ellipse-outline" class="player1" v-if="item[0]"></ion-icon>
            <ion-icon name="ellipse-outline" class="player2" v-if="item[1]"></ion-icon>
          </div>
        </div>
      </n-gi>
    </n-grid>
  </div>
  <div>
    <div style="text-align: center; top: 0">
      <ion-icon
        name="ellipse-outline"
        style="background-color: #f26b5e; color: #ffffff; width: 5vw; height: 5vw"
      ></ion-icon
      ><a style="font-size: 5vw; color: #f26b5e">{{ game.user0 }}:{{ game.score[0] }}</a>

      <n-button
        size="large"
        style="top: 0; height: 3em; width: 13em; border: 4px solid; color: #00e4f0"
        @click="draw()"
      >
        {{ DrawText }}</n-button
      >

      <a style="top: 0; font-size: 5vw; color: #e6dd35d0">{{ game.user1 }}:{{ game.score[1] }}</a
      ><ion-icon
        name="ellipse-outline"
        style="background-color: #e6dd35d0; color: rgb(0, 0, 0); width: 5vw; height: 5vw"
      ></ion-icon>
    </div>
  </div>
</template>
<style scoped>
.player1 {
  color: #ffffff;
  width: 80%;
  height: 80%;
}
.player1_chosed {
  color: white;
  width: 80%;
  height: 80%;
}
.player2 {
  color: rgb(0, 0, 0);
  width: 80%;
  height: 80%;
}

.light_green {
  aspect-ratio: 1 / 1;
  border: 0.001em solid;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #535033;
}
.p1 {
  aspect-ratio: 1 / 1;
  border: 0.001em solid;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f26b5e;
}
.p2 {
  aspect-ratio: 1 / 1;
  border: 0.001em solid;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e6dd35d0;
}
.nend > * {
  border-color: #8abf54;
}
.end > * {
  border-color: #6643e6;
}
.light_blue {
  opacity: 0.6;
  background-color: rgb(255, 0, 0);
}
.green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.24);
}
.box {
  margin-left: auto;
  margin-right: auto;
  max-height: 78vw;
  max-width: 78vw;
  width: 78vh;
  height: 78vh;
}
</style>