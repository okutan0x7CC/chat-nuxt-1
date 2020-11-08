
const LIMIT_OF_POSTS_TO_GET_AT_ONCE = 30

const Post = class {
  constructor ({ id, messageText, userId, nickname, timestamp }) {
    this.id = id
    this.messageText = messageText
    this.userId = userId
    this.nickname = nickname
    this.timestamp = timestamp
  }

  static MAX_LENGTH_OF_MESSAGE_TEXT = 120

  validateForSend () {
    if (this.userId === null || this.nickname === null) {
      throw Post.errorMessages.NEED_LOGIN
    }
    if (this.messageText === null || this.messageText.length === 0) {
      throw Post.errorMessages.POST_MESSAGE_EMPTY
    }
    if (this.messageText.length > Post.MAX_LENGTH_OF_MESSAGE_TEXT) {
      throw this.errorMessageOfPostMessageOver()
    }
  }

  static errorMessages = {
    NEED_LOGIN: 'Login is required.',
    POST_MESSAGE_EMPTY: "can't send with empty message"
  }

  errorMessageOfPostMessageOver () {
    return `Please limit your message to ${Post.MAX_LENGTH_OF_MESSAGE_TEXT} characters.`
  }
}

export const state = () => ({
  posts: [],
  hiddenPostIds: [],
  anyMorePosts: false
})

export const mutations = {
  addPostAtFirst (state, post) {
    state.posts.unshift(post)
  },
  addPostsAtLast (state, posts) {
    state.posts.push(...posts)
  },
  setAnyMorePosts (state, anyMore) {
    state.anyMorePosts = anyMore
  },
  overwriteHiddenPostIds (state, postIds) {
    state.hiddenPostIds = postIds
  },
  resetState (state) {
    state.posts = []
    state.hiddenPostIds = []
    state.anyMorePosts = false
  },
  dropLastPosts (state, { remainCount }) {
    state.posts.splice(remainCount)
  }
}

export const getters = {
  posts (state) {
    return state.posts
  },
  postsRef (state, getters, rootState, rootGetters) {
    return window.$nuxt.$fire.database.ref(`posts/${rootGetters['client_user/client_user/roomId']}`)
  },
  postIdOfLast (state) {
    return state.posts[state.posts.length - 1].id
  },
  anyMorePosts (state) {
    return state.anyMorePosts
  },
  hiddenPostsRef (state, getters, rootState, rootGetters) {
    return window.$nuxt.$fire.database.ref(`hiddenPosts/${rootGetters['client_user/client_user/roomId']}`)
  },
  isHidden (state) {
    return (postId) => {
      return state.hiddenPostIds.includes(postId)
    }
  }
}

export const actions = {
  listen ({ getters, commit }) {
    commit('resetState')
    getters.hiddenPostsRef
      .on('value', (snapshot) => {
        const hiddenPostIds = Object.keys(snapshot.val() || {})
        commit('overwriteHiddenPostIds', hiddenPostIds)
      })
    getters.postsRef
      .orderByKey()
      .limitToLast(LIMIT_OF_POSTS_TO_GET_AT_ONCE)
      .on('child_added', (snapshot) => {
        const value = snapshot.val()
        commit('addPostAtFirst', new Post({
          id: snapshot.key,
          messageText: value.messageText,
          userId: value.userId,
          nickname: value.nickname,
          timestamp: value.timestamp
        }))
      })
  },
  detach ({ getters }) {
    getters.postsRef.off()
    getters.hiddenPostsRef.off()
  },
  send ({ getters, rootGetters }, messageText) {
    const newPost = new Post({
      messageText,
      userId: rootGetters['client_user/client_user/userId'],
      nickname: rootGetters['client_user/client_user/nickname']
    })

    newPost.validateForSend()

    getters.postsRef.push({
      userId: newPost.userId,
      messageText: newPost.messageText,
      timestamp: window.$nuxt.$fireModule.database.ServerValue.TIMESTAMP,
      nickname: newPost.nickname
    })
  },
  loadMore ({ getters, commit }) {
    getters.postsRef
      .orderByKey()
      .endAt(getters.postIdOfLast)
      .limitToLast(LIMIT_OF_POSTS_TO_GET_AT_ONCE + 1)
      .once('value', (snapshot) => {
        const numOfPosts = snapshot.numChildren()
        if (numOfPosts < LIMIT_OF_POSTS_TO_GET_AT_ONCE + 1) {
          commit('setAnyMorePosts', true)
        }
        if (numOfPosts === 0) {
          return
        }

        const postsOrderedByKeyDesc = []
        snapshot.forEach((childSnapshot) => {
          const value = childSnapshot.val()
          postsOrderedByKeyDesc.unshift(new Post({
            id: childSnapshot.key,
            messageText: value.messageText,
            userId: value.userId,
            nickname: value.nickname,
            timestamp: value.timestamp
          }))
        })
        postsOrderedByKeyDesc.shift() // remove duplicate post at end

        window.$nuxt.$store.commit('posts/posts/addPostsAtLast', postsOrderedByKeyDesc)
      })
  }
}
