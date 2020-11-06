
const LIMIT_OF_POSTS_TO_GET_AT_ONCE = 30
const MAX_LENGTH_OF_MESSAGE = 120

const errorMessages = {
  POST_MESSAGE_OVER: `Please limit your message to ${MAX_LENGTH_OF_MESSAGE} characters.`,
  NEED_LOGIN: 'Login is required.',
  POST_MESSAGE_EMPTY: "can't send with empty message"
}

export const state = () => ({
  postList: [],
  idList: [],
  hiddenPostIds: [],
  anyMorePosts: false
})

export const mutations = {
  addPostAtFirst (state, { postId, post }) {
    state.idList.unshift(postId)
    state.postList.unshift(post)
  },
  addPostsAtLast (state, { postIds, posts }) {
    state.idList.push(...postIds)
    state.postList.push(...posts)
  },
  setAnyMorePosts (state, { anyMore }) {
    state.anyMorePosts = anyMore
  },
  addHiddenPostId (state, { postId }) {
    state.hiddenPostIds.push(postId)
  }
}

export const getters = {
  posts (state) {
    return state.postList
  },
  postIds (state) {
    return state.idList
  },
  postsRef (state, getters, rootState, rootGetters) {
    return window.$nuxt.$fire.database.ref(`posts/${rootGetters['client_user/client_user/roomId']}`)
  },
  postIdOfLast (state) {
    return state.idList[state.idList.length - 1]
  },
  anyMorePosts (state) {
    return state.anyMorePosts
  },
  hiddenPostsRef (state, getters, rootState, rootGetters) {
    return window.$nuxt.$fire.database.ref(`hidden_posts/${rootGetters['client_user/client_user/roomId']}`)
  },
  hiddenPostIds (state) {
    return state.hiddenPostIds
  }
}

export const actions = {
  listen ({ getters, commit }) {
    commit('setAnyMorePosts', { anyMore: false })
    getters.hiddenPostsRef
      .on('child_added', (snapshot) => {
        commit('addHiddenPostId', { postId: snapshot.key })
      })
    getters.postsRef
      .orderByKey()
      .limitToLast(LIMIT_OF_POSTS_TO_GET_AT_ONCE)
      .on('child_added', (snapshot) => {
        commit('addPostAtFirst', { postId: snapshot.key, post: snapshot.val() })
      })
  },
  detach ({ getters, commit }) {
    getters.postsRef.off()
  },
  send ({ getters, rootGetters }, { messageText }) {
    const clientUserId = rootGetters['client_user/client_user/userId']
    const clientUserNickname = rootGetters['client_user/client_user/nickname']
    if (clientUserId === null || clientUserNickname === null) {
      throw errorMessages.NEED_LOGIN
    }

    if (messageText.length === 0) {
      throw errorMessages.POST_MESSAGE_EMPTY
    }
    if (messageText.length > MAX_LENGTH_OF_MESSAGE) {
      throw errorMessages.POST_MESSAGE_OVER
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
  loadMore ({ getters, commit }) {
    getters.postsRef
      .orderByKey()
      .endAt(getters.postIdOfLast)
      .limitToLast(LIMIT_OF_POSTS_TO_GET_AT_ONCE + 1)
      .once('value', (snapshot) => {
        const numOfPosts = snapshot.numChildren()
        if (numOfPosts < LIMIT_OF_POSTS_TO_GET_AT_ONCE + 1) {
          commit('setAnyMorePosts', { anyMore: true })
        }
        if (numOfPosts === 0) {
          return
        }

        const postIdsOrderedByKeyDesc = []
        const postsOrderedByKeyDesc = []
        snapshot.forEach((childSnapshot) => {
          postIdsOrderedByKeyDesc.unshift(childSnapshot.key)
          postsOrderedByKeyDesc.unshift(childSnapshot.val())
        })
        postIdsOrderedByKeyDesc.shift() // remove duplicate post at end
        postsOrderedByKeyDesc.shift()

        window.$nuxt.$store.commit('posts/posts/addPostsAtLast', {
          postIds: postIdsOrderedByKeyDesc,
          posts: postsOrderedByKeyDesc
        })
      })
  }
}
