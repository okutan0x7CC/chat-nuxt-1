<template>
  <div>
    <transition-group name="list">
      <v-card
        v-for="post in posts"
        :key="post.id"
        class="mx-auto mb-3"
        max-width="400"
        dark
      >
        <v-card-text class="headline font-weight-bold">
          {{ post.messageText }}
        </v-card-text>
        <v-card-actions>
          <v-list-item class="grow">
            <v-list-item-content>
              <v-list-item-title>{{ post.nickname }}</v-list-item-title>
            </v-list-item-content>
            <div
              justify="end"
              class="caption"
            >
              {{ post.timestamp | formatDate }}
            </div>
          </v-list-item>
        </v-card-actions>
      </v-card>
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
import moment from 'moment-timezone'

const MAX_NUM_OF_POSTS_TO_HOLD = 120

export default {
  filters: {
    formatDate (timestamp) {
      return moment(timestamp, 'x').tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')
    }
  },
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
