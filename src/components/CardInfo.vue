<template>
  <v-card  flat>
    <v-sheet class="CardInfoSheet ma-0 pa-5">
      <span class="white--text font-weight-bold">
        {{ message }}
      </span>
      <v-list color="transparent" class="white-text">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-icon color="white" x-large>
                {{ icon }}
              </v-icon>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
              <v-list-item-title class="text-lg-h3 white--text">
                {{ number }}
              </v-list-item-title>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-sheet>
  </v-card>
</template>

<script>
export default {
name: "CardInfo",
  props: [
      'message','number','icon'
  ]
}
</script>

<style scoped>
  .CardInfoSheet{
    background-image: linear-gradient(270deg,#3a7bd5,#3a6073);
  }

</style>