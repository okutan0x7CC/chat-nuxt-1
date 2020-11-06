export const state = () => ({
  userId: 'test_id_1',
  nickname: 'test_nickanme_1',
  enteringRoomId: null
})

export const mutations = {
  login (state, userId, user) {
    state.userId = userId
    state.nickname = user.nickname
  },
  enterRoom (state, roomId) {
    state.enteringRoomId = roomId
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
