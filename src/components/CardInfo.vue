<template>
  <v-card  elevation="5" class="rounded-lg"
  >
    <v-sheet
        class="ma-0 pa-5 pb-0"
        :style="styleColor"
    >
      <span class="white--text font-weight-bold">
        {{ message }}
      </span>
      <v-list color="transparent" class="white-text">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-icon color="white" size="100">
                {{ icon }}
              </v-icon>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
              <v-list-item-title class="white--text text-h1 font-weight-bold">
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
      'message','number','icon','firstColor','secondColor'
  ],
  computed:{
    styleColor(){
      return 'background-image: linear-gradient(270deg,#' + this.secondColor +  ' ,#' + this.firstColor +  ')';
    }
  }
}
</script>

<style scoped>
  /*.CardInfoSheet{*/
  /*  background-image: linear-gradient(270deg,#3a7bd5,#3a6073);*/
  /*}*/

</style>