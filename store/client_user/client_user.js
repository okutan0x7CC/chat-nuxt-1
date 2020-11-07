export const state = () => ({
  userId: 'test_id_1',
  nickname: 'test_nickanme_1',
  enteringRoomId: null
})

export const mutations = {
  setUser (state, userId, user) {
    state.userId = userId
    state.nickname = user.nickname
  },
  setEnteringRoomId (state, roomId) {
    state.enteringRoomId = roomId
  },
  resetUser (state) {
    state.userId = null
    state.nickname = null
  }
}

export const getters = {
  userId (state) {
    return state.userId
  },
  nickname (state) {
    return state.nickname
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
  }
}
