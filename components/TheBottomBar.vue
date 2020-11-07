<template>
  <v-app-bar
    app
    bottom
    height="auto"
  >
    <v-textarea
      v-model="messageText"
      type="text"
      value=""
      placeholder="hello world"
      auto-grow
      rows="1"
      :append-outer-icon="'mdi-send'"
      clearable
      hide-details
      min-height="46px"
      :maxlength="120"
      @click:append-outer="sendPost"
      @click:clear="clearMessageText"
    />
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    messageText: ''
  }),
  computed: {
    appBarHeight () {
      return this.rowHeight
    },
    ...mapGetters({
      room: 'room/room/room'
    })
  },
  methods: {
    sendPost () {
      try {
        this.$store.dispatch('posts/posts/send', this.messageText)
      } catch (errorMessage) {
        alert(errorMessage)
      }
      this.clearMessageText()
    },
    clearMessageText () {
      this.messageText = null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
