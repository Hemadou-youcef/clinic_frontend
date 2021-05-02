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

  },

};
</script>
