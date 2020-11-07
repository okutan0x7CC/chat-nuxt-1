<template>
  <v-app-bar
    app
  >
    <v-toolbar-title class="text-center mx-auto">
      {{ room !== null ? room.title : "" }}
    </v-toolbar-title>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    room: 'room/room/room'
  })
}
</script>

<style>

</style>
