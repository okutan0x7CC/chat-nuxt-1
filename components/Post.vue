<template>
  <v-card
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
  }
}
</script>

<style>

</style>
