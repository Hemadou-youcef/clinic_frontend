<template>

  <v-app>
    <NavBar v-if="authenticated" v-on:changeMode="modeChanger" :mode="mode"></NavBar>

    <v-main>
      <router-view :mode="mode"></router-view>
    </v-main>
  </v-app>



</template>

<script>
import NavBar  from "./components/NavBar";
export default {
  name: 'App',
  components : {
    NavBar,
  },
  data(){
    return {
      mode: true
    }
  }
  ,
  methods: {
    modeChanger(){
      if (this.mode){
        this.mode = false
      }else{
        this.mode = true
      }
    }
  },
  computed: {
    authenticated() {
      return  this.$store.state.authenticated;
    }
  }
  ,
  created() {
      this.axios.post('/user')
          // eslint-disable-next-line no-unused-vars
          .then(res =>
        {
          this.$store.dispatch('getUser')
            console.log('App check auth OK')
        }).catch(() => {
            this.$store.dispatch('logout')
      })
  },
};
</script>

<style >
  .v-main {
    background-color: #ecf0f4;
  }
</style>