<template>
  <v-app>
    <v-app-bar
      app
      color="secondry"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://www.pngrepo.com/download/284250/surgeon-doctor.png"
          transition="scale-transition"
          width="40"

        />

        <div>
          Clinic Panel
        </div>
      </div>

      <v-spacer></v-spacer>
        <v-btn
          to="/login"
        >
          <span class="mr-2">Login</span>
          <v-icon>mdi-arrow-right-bold-box</v-icon>
        </v-btn>


    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',


  data: () => ({
    //
  }),
};
</script>
