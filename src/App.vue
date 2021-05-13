<template>

  <v-app>
    <NavBar v-if="authenticated" v-on:changeMode="modeChanger" :mode="GetAppmode"></NavBar>

    <v-main>
      <router-view :mode="GetAppmode"></router-view>
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
      mode: JSON.parse(localStorage.getItem('mode'))
    }
  }
  ,
  methods: {
    modeChanger(){
      console.log(this.mode)
      if(this.mode){
        this.mode = false
      }else{
        this.mode = true
      }
      localStorage.setItem('mode',this.mode)
      this.$store.commit('setMode',this.mode)
    }
  },
  computed: {
    authenticated() {
      return  this.$store.state.authenticated;
    },
    GetAppmode(){
      return JSON.parse(this.$store.state.mode)
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