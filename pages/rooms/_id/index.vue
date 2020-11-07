<template>
  <div>
    <transition-group name="list">
      <ul v-for="post in posts" :key="post.id">
        <li>id: {{ post.id }}</li>
        <li>messageText: {{ post.messageText }}</li>
        <li>userId: {{ post.userId }}</li>
        <li>nickname: {{ post.nickname }}</li>
        <li>timestamp: {{ post.timestamp }}</li>
        <hr>
      </ul>
    </transition-group>

    <div>
      <button @click="loadMore()">
        load_more
      </button>
    </div>
    <TheBottomBar />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const MAX_NUM_OF_POSTS_TO_HOLD = 120

export default {
  computed: mapGetters({
    posts: 'posts/posts/posts'
  }),
  watch: {
    posts (before, after) {
      if (this.isEnabledAutoScroll() && after.length > MAX_NUM_OF_POSTS_TO_HOLD) {
        this.$store.commit('posts/posts/dropLastPosts', { remainCount: MAX_NUM_OF_POSTS_TO_HOLD })
      }
    }
  },
  created () {
    const roomId = this.$route.params.id
    this.$store.dispatch('client_user/client_user/enterRoom', roomId)
    this.$store.dispatch('posts/posts/listen')
  },
  beforeDestroy () {
    this.$store.commit('room/room/resetState')
    this.$store.commit('posts/posts/resetState')
    this.$store.dispatch('posts/posts/detach')
  },
  methods: {
    loadMore () {
      this.$store.dispatch('posts/posts/loadMore')
    },
    isEnabledAutoScroll () {
      const scrolledHeightFromTop = window.document.body.scrollTop || window.document.documentElement.scrollTop
      return scrolledHeightFromTop < 10
    }
  }
}
</script>

<style lang="scss" scoped>
.list-enter-active {
  transition: all 0.3s ease-out;
}
.list-enter {
  transform: translateY(-100%);
}
</style>>
