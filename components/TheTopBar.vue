<template>
  <v-app-bar
    dense
    flat
    app
  >
    <v-toolbar-title>
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
