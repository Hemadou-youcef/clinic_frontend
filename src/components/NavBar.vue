<template>
  <div>
    <v-app-bar
        class="pt-1"
        dense

        app
        mobile-break-point="960"
        color="white"
        flat




    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="">{{$store.state.navBarTitle}}</v-toolbar-title>
      <v-spacer></v-spacer>


    </v-app-bar>
    <v-navigation-drawer  width="260"  v-model="drawer" app>
<!--      <template v-slot:img="props">-->
<!--        <v-img-->
<!--            :gradient="`to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, .5)`"-->
<!--            v-bind="props"-->
<!--        />-->
<!--      </template>-->
      <v-list-item class="pa-2">
        <v-spacer></v-spacer>
        <v-list-item-avatar width="80" height="80">
          <v-img
              :src="logo"></v-img>
        </v-list-item-avatar>
        <v-spacer></v-spacer>
      </v-list-item>
      <v-list-item class="align-center">
        <v-spacer></v-spacer>
        <div>{{ this.$store.state.role.toUpperCase() }} : {{ this.$store.state.user.firstname }} {{ this.$store.state.user.lastname }}
        </div>

        <v-spacer></v-spacer>
      </v-list-item>
        <v-divider></v-divider>
      <v-list-item-group class="pt-3" color="primary" v-model="selectedItem">
        <v-list rounded>
          <v-list-item class="mx-4 d-flex align-center justify-center" v-for="item in drawer_items" :key="item.item"
                       link :to="item.to">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              {{ item.item }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-list-item-group>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn depressed outlined block @click="logout">Logout
            <v-icon right>mdi-account-remove</v-icon>
          </v-btn>
        </div>
      </template>


    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data: () => ({
    drawer: true,
    selectedItem: 1,
    drawer_items: [
      {'item': 'Appointment', 'icon': 'mdi-calendar-check', 'to': '/appointments'},
      {'item': 'Patients', 'icon': 'mdi-account-supervisor', 'to': '/patients'},
      {'item': 'Medicines', 'icon': 'mdi-pill', 'to': '/medicines'},

    ]
  }),
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  },
  computed: {
    getRole() {
      return this.$store.state.role;
    },

    logo() {
      if (this.getRole == 'doctor') {
        return 'https://previews.123rf.com/images/yupiramos/yupiramos1607/yupiramos160705616/59613224-doctor-avatar-profile-isolated-icon-vector-illustration-graphic-.jpg'
      }
      return 'https://cdn1.iconfinder.com/data/icons/avatar-3/512/Secretary-512.png';
    }
  },
  created() {

    if (this.getRole == 'doctor') {
      this.drawer_items.push({'item': 'Consultation', 'icon': 'mdi-heart-pulse', 'to': '/consultation'});
    }
  }

}
</script>

<style scoped>
.v-list .v-list-item--active {
  background-color: rgb(9, 220, 164) !important;

  /*background-color:#02333C !important;*/
  color: white !important;;
}
</style>