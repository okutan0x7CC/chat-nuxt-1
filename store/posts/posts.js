
export const state = () => ({
  post_list: [],
  id_list: []
})

export const mutations = {
  addPostAtFirst (state, { postId, post }) {
    state.id_list.unshift(postId)
    state.post_list.unshift(post)
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
    return window.$nuxt.$fire.database.ref(`posts/${rootGetters['login_user/login_user/roomId']}`)
  }
}

export const actions = {
  listen ({ getters, commit }) {
    getters.postsRef.on('child_added', (snapshot) => {
      commit('addPostAtFirst', { postId: snapshot.key, post: snapshot.val() })
    })
  },
  detach ({ getters }) {
    getters.postsRef.off()
  },
  send ({ getters, rootGetters }, { messageText }) {
    const loginUserId = rootGetters['login_user/login_user/userId']
    const loginUserNickname = rootGetters['login_user/login_user/nickname']
    getters.postsRef.push(
      {
        user_id: loginUserId,
        message_text: messageText,
        timestamp: window.$nuxt.$fireModule.database.ServerValue.TIMESTAMP,
        nickname: loginUserNickname
      }
    )
  }
}
