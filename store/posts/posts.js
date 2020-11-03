
export const state = () => ({
  post_list: [],
  id_list: []
})

export const mutations = {
  addPostAtFirst (state, post) {
    state.post_list.unshift(post)
  },
  addIdAtFirst (state, id) {
    state.id_list.unshift(id)
  }
}

export const getters = {
  posts (state) {
    return state.post_list
  },
  postIds (state) {
    return state.id_list
  },
  postsRef (state, getters, rootState, rootGetters) {
    return window.$nuxt.$fire.database.ref(`posts/${rootGetters['rooms/rooms/roomId']}`)
  }
}

export const actions = {
  listenPosts ({ commit, getters }) {
    getters.postsRef.on('child_added', (snapshot) => {
      commit('addIdAtFirst', snapshot.key)
      commit('addPostAtFirst', snapshot.val())
    })
  }
}
