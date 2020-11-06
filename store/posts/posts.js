
const LIMIT_OF_POSTS_TO_GET_AT_ONCE = 30
const MAX_LENGTH_OF_MESSAGE = 120

const errorMessages = {
  POST_MESSAGE_OVER: `Please limit your message to ${MAX_LENGTH_OF_MESSAGE} characters.`,
  NEED_LOGIN: 'Login is required.'
}

export const state = () => ({
  post_list: [],
  id_list: []
})

export const mutations = {
  addPostAtFirst (state, { postId, post }) {
    state.id_list.unshift(postId)
    state.post_list.unshift(post)
  },
  addPostsAtLast (state, { postIds, posts }) {
    state.id_list.push(...postIds)
    state.post_list.push(...posts)
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
    return window.$nuxt.$fire.database.ref(`posts/${rootGetters['client_user/client_user/roomId']}`)
  },
  postIdOfLast (state) {
    return state.id_list[state.id_list.length - 1]
  }

}

export const actions = {
  listen ({ getters, commit }) {
    getters.postsRef
      .orderByKey()
      .limitToLast(LIMIT_OF_POSTS_TO_GET_AT_ONCE)
      .on('child_added', (snapshot) => {
        commit('addPostAtFirst', { postId: snapshot.key, post: snapshot.val() })
      })
  },
  detach ({ getters }) {
    getters.postsRef.off()
  },
  send ({ getters, rootGetters }, { messageText }) {
    if (messageText.length > MAX_LENGTH_OF_MESSAGE) {
      throw errorMessages.POST_MESSAGE_OVER
    }

    const clientUserId = rootGetters['client_user/client_user/userId']
    const clientUserNickname = rootGetters['client_user/client_user/nickname']
    if (clientUserId === null || clientUserNickname === null) {
      throw errorMessages.NEED_LOGIN
    }

    getters.postsRef.push(
      {
        user_id: clientUserId,
        message_text: messageText,
        timestamp: window.$nuxt.$fireModule.database.ServerValue.TIMESTAMP,
        nickname: clientUserNickname
      }
    )
  },
  loadMore ({ getters }) {
    getters.postsRef
      .orderByKey()
      .endAt(getters.postIdOfLast)
      .limitToLast(LIMIT_OF_POSTS_TO_GET_AT_ONCE + 1)
      .once('value', (snapshot) => {
        const postIdsOrderedByKeyDesc = []
        const postsOrderedByKeyDesc = []
        snapshot.forEach((childSnapshot) => {
          postIdsOrderedByKeyDesc.unshift(childSnapshot.key)
          postsOrderedByKeyDesc.unshift(childSnapshot.val())
        })
        postIdsOrderedByKeyDesc.shift() // remove endAt Post
        postsOrderedByKeyDesc.shift()

        window.$nuxt.$store.commit('posts/posts/addPostsAtLast', {
          postIds: postIdsOrderedByKeyDesc,
          posts: postsOrderedByKeyDesc
        })
      })
  }
}
