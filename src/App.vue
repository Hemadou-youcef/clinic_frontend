<template>

  <v-app>
    <NavBar v-if="authenticated"></NavBar>

    <v-main>
      <router-view></router-view>
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
    }
  }
  ,
  methods: {
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