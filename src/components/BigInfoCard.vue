<template>
  <v-card class="rounded-0 pa-2" elevation="0" :dark="darkMode" style="border-right: 1px solid #CCD6DD">
    <v-list-item>
      <div :class="`${ color } pa-3 rounded-b-xl rounded-tl-xl mr-5`">
        <v-icon color="white" large>
          {{ icon }}
        </v-icon>
      </div>
      <v-list-item-content>
        <v-list-item-title :class="`font-weight-bold text-lg-h2 ${ color }--text text--lighten-1`">{{ value  }}</v-list-item-title>
        <v-list-item-subtitle class="text-lg-h5" :class="{'white--text':darkMode}">{{ text }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: "BigInfoCard",
  props: [
      'text','value','color','icon','darkMode'
  ]
}
</script>

<style scoped>

</style>