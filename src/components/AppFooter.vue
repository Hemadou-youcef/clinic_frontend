<template>
  <v-footer
      :color="(darkMode)? '#1E1E1E':'#01579B'"
      padless
  >
    <v-row
        justify="center"
        no-gutters
    >

      <v-col
          class=" py-4 text-center white--text"

          cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>Clinic</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter",
  data: () => ({
    links: [
      'Home',
      'About Us',
      'Team',
      'Services',
      'Blog',
      'Contact Us',
    ],
  }),
  props: [
      'darkMode'
  ]
}
</script>

<style scoped>

</style>