import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useGameStore = defineStore('game', {
  // arrow function recommended for full type inference
  state: () => ({
    game: reactive({
      id: '',
      started: false,
      map: Array,
      view: Array,
      chosen: false,
      draw: false,
      player0: Array,
      player1: Array,
      user0: String,
      user1: String,
      isOne: false,
      Spect: true,
      score: Array(2)
    })
  }),
  actions: {
    reset() {
      Object.assign(this, {
        game: reactive({
          id: '',
          started: false,
          map: Array,
          view: Array,
          chosen: false,
          draw: false,
          player0: Array,
          player1: Array,
          user0: String,
          user1: String,
          isOne: false,
          Spect: true,
          score: Array(2)
        })
      })
    }
  },
  persist: true
})
