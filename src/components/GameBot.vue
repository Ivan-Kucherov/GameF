<script>
import { ref, reactive, computed } from 'vue'
import { EllipseOutline } from '@vicons/ionicons5'
import configs from '../../config.json'
import axios, { AxiosError } from 'axios'
import { useMessage } from 'naive-ui'
//import { ifError } from 'assert'
import { useGameStore } from '@/stores/GameStore'

/**
 *@typedef {any} NewType
 */

export default {
  setup() {
    const message = useMessage()
    const game_ = useGameStore()
    const game = computed(() => game_.game)
    console.log(game)
    return {
      game,
      message
    }
  },
  methods: {
    CreateGame() {
      this.game.view = new Array(16)
      for (let index = 0; index < this.game.view.length; index++) {
        this.game.view[index] = new Array(16)
        for (let index2 = 0; index2 < this.game.view[index].length; index2++) {
          this.game.view[index][index2] = false
        }
      }
      axios({
        method: 'get',
        url: '/game/creategame/',
        data: ''
      })
        .then((response) => {
          if (response.status == 200) {
            const result = JSON.stringify(response.data, null, 2)
            this.game.map = response.data.map
            this.message.success(response.data.map)
            this.game.started = true
          }
        })
        .catch((error) => {
          //const originalRequest = error.config;
          console.log(`🚨 Error: ${error.message}`)
          //return axios(originalRequest) // here it messes up in setting the header correctly
        })
    },
    Chose(item, index1, index2) {
      //this.message.success(JSON.parse(localStorage.tokens).access);
      if (item[0]) {
        this.game.chosen = true
        this.game.player1 = [index1, index2]
        try {
          this.game.view[index1 + 1][index2] = true
        } catch (e) {}
        try {
          this.game.view[index1 + 1][index2 + 1] = true
        } catch (e) {}
        try {
          this.game.view[index1][index2 + 1] = true
        } catch (e) {}
        try {
          this.game.view[index1 - 1][index2 + 1] = true
        } catch (e) {}
        try {
          this.game.view[index1 - 1][index2] = true
        } catch (e) {}
        try {
          this.game.view[index1 - 1][index2 - 1] = true
        } catch (e) {}
        try {
          this.game.view[index1][index2 - 1] = true
        } catch (e) {}
        try {
          this.game.view[index1 + 1][index2 - 1] = true
        } catch (e) {}
      } else if (
        this.game.chosen &&
        Math.abs(index1 - this.game.player1[0]) < 2 &&
        Math.abs(index2 - this.game.player1[1]) < 2
      ) {
        axios({
          method: 'post',
          url: '/game/movebot/',
          data: [index1, index2]
        })
          .then((response) => {
            const result = JSON.stringify(response.data, null, 2)
            console.log(result)
          })
          .catch((error) => {
            console.log(`🚨 Error: ${error.message}`)
          })
        item[0] = true
        this.game.map[this.game.player1[0]][this.game.player1[1]][0] = false
        try {
          this.game.view[this.game.player1[0] + 1][this.game.player1[1]] = false
        } catch (e) {}
        try {
          this.game.view[this.game.player1[0] + 1][this.game.player1[1] + 1] = false
        } catch (e) {}
        try {
          this.game.view[this.game.player1[0]][this.game.player1[1] + 1] = false
        } catch (e) {}
        try {
          this.game.view[this.game.player1[0] - 1][this.game.player1[1] + 1] = false
        } catch (e) {}
        try {
          this.game.view[this.game.player1[0] - 1][this.game.player1[1]] = false
        } catch (e) {}
        try {
          this.game.view[this.game.player1[0] - 1][this.game.player1[1] - 1] = false
        } catch (e) {}
        try {
          this.game.view[this.game.player1[0]][this.game.player1[1] - 1] = false
        } catch (e) {}
        try {
          this.game.view[this.game.player1[0] + 1][this.game.player1[1] - 1] = false
        } catch (e) {}
        this.game.player1 = [index1, index2]
        try {
          this.game.view[index1 + 1][index2] = true
        } catch (e) {}
        try {
          this.game.view[index1 + 1][index2 + 1] = true
        } catch (e) {}
        try {
          this.game.view[index1][index2 + 1] = true
        } catch (e) {}
        try {
          this.game.view[index1 - 1][index2 + 1] = true
        } catch (e) {}
        try {
          this.game.view[index1 - 1][index2] = true
        } catch (e) {}
        try {
          this.game.view[index1 - 1][index2 - 1] = true
        } catch (e) {}
        try {
          this.game.view[index1][index2 - 1] = true
        } catch (e) {}
        try {
          this.game.view[index1 + 1][index2 - 1] = true
        } catch (e) {}
        this.game.chosen = true
      }
    },
    Log(item) {
      for (let [dis1, index1] of item.entries()) {
        console.log(dis1)
        console.log(index1)
        console.log(this.game.view[index1][0])
      }
    }
  },
  mounted() {},
  created() {
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
  }
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
function SendMove(index1, index2) {}
//<n-button @click="Log(this.game.map)">log</n-button>
//v-bind:class="{'p1':item[2],'p2':item[3],'light_green': !(item[2] || item[3]),'p1 light_blue': this.game.view[index1][index2]}"
</script>

<template>
  <n-button v-if="!this.game.started" @click="CreateGame()">Начать</n-button>
  <div v-if="this.game.started" class="box">
    <n-grid
      v-for="[index1, dis1] of this.game.map.entries()"
      :cols="16"
      x-gap="0"
      v-bind:key="dis1"
    >
      <n-gi v-for="[index2, item] of dis1.entries()" v-bind:key="item">
        <div v-bind:class="{ light_blue: this.game.view[index1][index2] }">
          <div
            v-bind:class="{ p1: item[2], p2: item[3], light_green: !(item[2] || item[3]) }"
            @click="Chose(item, index1, index2)"
          >
            <ion-icon
              name="ellipse-outline"
              v-bind:class="{
                player1: !this.game.view[index1][index2],
                player1_chosed: this.game.view[index1][index2]
              }"
              v-if="item[0]"
              @click="Chose(item, index1, index2)"
            ></ion-icon>
            <ion-icon name="ellipse-outline" class="player2" v-if="item[1]"></ion-icon>
          </div>
        </div>
      </n-gi>
    </n-grid>
  </div>
</template>
<style scoped>
.player1 {
  color: rgb(98, 255, 255);
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
  border-color: rgb(100, 118, 121);
  background-color: rgba(67, 139, 24, 0.699);
}
.p1 {
  aspect-ratio: 1 / 1;
  border: 0.001em solid;
  display: flex;
  justify-content: center;
  align-items: center;
  border-color: rgb(100, 118, 121);
  background-color: rgba(255, 0, 0, 0.699);
}
.p2 {
  aspect-ratio: 1 / 1;
  border: 0.001em solid;
  display: flex;
  justify-content: center;
  align-items: center;
  border-color: rgb(100, 118, 121);
  background-color: rgba(255, 0, 191, 0.699);
}
.light_blue {
  opacity: 0.8;
  background-color: rgb(229, 255, 0);
}
.green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.24);
}
.box {
  margin-left: auto;
  margin-right: auto;
  max-width: 75vh;
  max-height: 75vh;
}
</style>