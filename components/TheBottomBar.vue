<template>
  <v-container>
    <v-textarea
      v-model="messageText"
      outlined
      label="message"
      value=""
      placeholder="message"
      auto-grow
      rows="1"
    />
    <v-btn
      color="blue-grey"
      class="ma-2 white--text"
      @click="sendPost"
    >
      Send
      <v-icon
        right
        dark
      >
        mdi-send
      </v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    messageText: ''
  }),
  computed: mapGetters({
    room: 'room/room/room'
  }),
  methods: {
    sendPost () {
      try {
        this.$store.dispatch('posts/posts/send', this.messageText)
      } catch (errorMessage) {
        alert(errorMessage)
      }
      this.messageText = ''
    }
  }
}
</script>

<style>

</style>
