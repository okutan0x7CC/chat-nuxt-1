
export const state = () => ({
  enteringRoomID: null
})

export const getters = {
  roomId (state) {
    return state.enteringRoomID
  }
}

export const mutations = {
  enterRoom (state, roomId) {
    state.enteringRoomID = roomId
  }
}
