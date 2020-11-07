<template>
  <div>
    <ul v-for="(postId, index) in postIds" :key="postId">
      <li>post_id : {{ postId }}</li>
      <li v-for="(value, name) in posts[index]" :key="name">
        {{ name }} : {{ value }}
      </li>
      <hr>
    </ul>
    <div>
      <button @click="loadMore()">
        load_more
      </button>
      <button @click="sendPost()">
        send_post
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const MAX_NUM_OF_POSTS_TO_HOLD = 120

export default {
  computed: mapGetters({
    posts: 'posts/posts/posts',
    postIds: 'posts/posts/postIds'
  }),
  watch: {
    postIds (before, after) {
      if (this.isEnabledAutoScroll() && after.length > MAX_NUM_OF_POSTS_TO_HOLD) {
        this.$store.commit('posts/posts/dropLastPosts', { remainCount: MAX_NUM_OF_POSTS_TO_HOLD })
      }
    }
  },
  created () {
    const roomId = this.$route.params.id
    this.$store.dispatch('client_user/client_user/enterRoom', roomId)

    this.$store.commit('posts/posts/resetState')
    this.$store.dispatch('posts/posts/listen')
  },
  beforeDestroy () {
    this.$store.dispatch('posts/posts/detach')
  },
  methods: {
    loadMore () {
      this.$store.dispatch('posts/posts/loadMore')
    },
    sendPost () {
      try {
        this.$store.dispatch('posts/posts/send', { messageText: 'test_message_1' })
      } catch (errorMessage) {
        alert(errorMessage)
      }
    },
    isEnabledAutoScroll () {
      const scrolledHeightFromTop = window.document.body.scrollTop || window.document.documentElement.scrollTop
      return scrolledHeightFromTop < 10
    }
  }
}
</script>

<style>

</style>
