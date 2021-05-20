<template>
  <v-card  elevation="5" class="rounded-lg"
  >
    <v-sheet
        class="ma-0  pb-0"
        :class="{'pa-3':(mode != 'simple')}"
        :style="styleColor"
    >
      <span  v-if="mode != 'simple'" class="white--text font-weight-bold">
        {{ message }}
      </span>
      <v-list color="transparent" class="white-text ">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <span v-if="mode == 'simple'" class="white--text font-weight-bold text-h5">
                {{ message }}
              </span>
              <v-icon v-else color="white" size="50">
                {{ icon }}
              </v-icon>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
              <v-list-item-title class="white--text text-h3 font-weight-bold">
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
      'message','number','icon','firstColor','secondColor','mode',"lazyLoader"
  ],
  computed:{
    styleColor(){
      return 'background-image: linear-gradient(270deg,#' + this.secondColor +  ' ,#' + this.firstColor +  ')';
    }

  },
  watch:{
    message(){
      if(this.lazyLoader){
        this.$emit('lazyloader')
      }
    },
    number(){
      if(this.lazyLoader){
        this.$emit('lazyloader')
      }
    }
  },
  created() {
    if(this.lazyLoader){
      this.$emit('lazyloader')
    }

  }
}
</script>

<style scoped>
  /*.CardInfoSheet{*/
  /*  background-image: linear-gradient(270deg,#3a7bd5,#3a6073);*/
  /*}*/

</style>