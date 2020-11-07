
const Room = class {
  constructor ({ id, title }) {
    this.id = id
    this.title = title
  }
}

export const state = () => ({
  room: null
})

export const mutations = {
  setRoom (state, room) {
    state.room = room
  },
  resetState (state) {
    state.room = null
  }
}

export const getters = {
  room (state) {
    return state.room
  },
  roomsRef () {
    return window.$nuxt.$fire.database.ref('rooms')
  }
}

export const actions = {
  fetch ({ getters, commit }, roomId) {
    getters.roomsRef.child(roomId).once('value', (snapshot) => {
      const value = snapshot.val()
      if (value === null) {
        commit('setRoom', null)
        return
      }

      commit('setRoom', new Room({
        id: snapshot.key,
        title: value.title
      }))
    })
  }
}
