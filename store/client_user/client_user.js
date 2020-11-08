export const state = () => ({
  userId: null,
  enteringRoomId: null
})

export const mutations = {
  setUser (state, userId) {
    state.userId = userId
  },
  setEnteringRoomId (state, roomId) {
    state.enteringRoomId = roomId
  },
  resetUser (state) {
    state.userId = null
    state.enteringRoomId = null
  }
}

export const getters = {
  userId (state) {
    return state.userId
  },
  roomId (state) {
    return state.enteringRoomId
  }
}

export const actions = {
  enterRoom ({ commit, dispatch }, roomId) {
    commit('setEnteringRoomId', roomId)
    commit('room/room/resetState', null, { root: true })
    dispatch('room/room/fetch', roomId, { root: true })
  },
  signInAnonymous ({ state, commit }) {
    window.$nuxt.$fire.auth.signInAnonymously()
      .then((userCredential) => {
        commit('setUser', userCredential.user.uid)
      })
  }
}
