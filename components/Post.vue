<template>
  <div>
    <v-card
      v-if="canShow"
      class="mx-auto mb-3"
      max-width="400"
      dark
    >
      <v-list-item>
        <div
          class="overline"
        >
          {{ post.timestamp | formatDate }}
        </div>
      </v-list-item>
      <v-card-text class="headline font-weight-bold">
        {{ post.messageText }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import moment from 'moment-timezone'

export default {
  name: 'Post',
  filters: {
    formatDate (timestamp) {
      return moment(timestamp, 'x').tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')
    }
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    canShow () {
      if (this.$store.getters['client_user/client_user/userId'] === this.post.userId) {
        return true
      }
      return !this.$store.getters['posts/posts/isHidden'](this.post.id)
    }
  }
}
</script>

<style>

</style>
