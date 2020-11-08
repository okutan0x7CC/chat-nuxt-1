<template>
  <div>
    <transition-group name="list">
      <Post
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </transition-group>
    <div
      v-observe-visibility="{
        callback: loadMorePosts,
        throttleOptions: {
          leading: 'visible'
        }
      }"
      class="py-10"
    />
    <TheBottomBar />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Post from '~/components/Post'

const MAX_NUM_OF_POSTS_TO_HOLD = 120

export default {
  components: {
    Post
  },
  computed: mapGetters({
    posts: 'posts/posts/posts'
  }),
  watch: {
    posts (after, before) {
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
    isEnabledAutoScroll () {
      const scrolledHeightFromTop = window.document.body.scrollTop || window.document.documentElement.scrollTop
      return scrolledHeightFromTop < 10
    },
    loadMorePosts (visiable) {
      if (!visiable || this.posts.length === 0) {
        return
      }
      this.$store.dispatch('posts/posts/loadMore')
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
