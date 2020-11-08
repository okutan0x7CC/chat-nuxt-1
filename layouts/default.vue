<template>
  <v-app dark>
    <TheTopBar />
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  created () {
    this.$store.dispatch('client_user/client_user/signInAnonymous')
  }
}
</script>
