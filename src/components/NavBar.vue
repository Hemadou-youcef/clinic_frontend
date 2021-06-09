<template>
  <div>
    <v-app-bar
        app
        mobile-break-point="960"
        :color="(mode)?'#09DCA4':'primary'"
        flat
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="white--text font-weight-bold">{{$store.state.navBarTitle}}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn @click="$emit('changeMode')" icon>
          <v-icon color="white">
            mdi-format-color-fill
          </v-icon>
      </v-btn>
      <v-btn @click="logout" icon>
<!--        <v-badge color="red" bottom left overlap>-->
<!--          <v-icon color="white">-->
<!--            mdi-forum-->
<!--          </v-icon>-->
<!--          <template v-slot:badge>-->
<!--            <div>-->
<!--              5-->
<!--            </div>-->
<!--          </template>-->
<!--        </v-badge>-->
        <v-icon color="white">mdi-export</v-icon>
      </v-btn>


    </v-app-bar>
    <v-navigation-drawer  width="260"  v-model="drawer" app>
<!--      <template v-slot:img="props">-->
<!--        <v-img-->
<!--            :gradient="`to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, .5)`"-->
<!--            v-bind="props"-->
<!--        />-->
<!--      </template>-->
      <v-card flat class="pa-2 pt-4 darken-2 white--text font-weight-bold rounded-0" height="64px" :color="(mode)?'#00b383':'primary darken-2'">
        <v-icon color="white" large>
          mdi-hospital-building
        </v-icon>
        <span :class="`text-subtitle-${(MiniLogo)?'2':'1'}`">
          Clinic Management System
        </span>
<!--        {{ (MiniLogo)?'CLINIC-MS':'Clinic Management System'}}-->

      </v-card>
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
      <v-list-item-group class="pt-3" v-model="selectedItem">
        <v-list>
          <v-list-item
              class="mx-4 mb-2 d-flex align-center justify-center rounded-lg"
              v-for="item in drawer_items" :key="item.item"
              link :to="item.to"
              :class="( metaRoute.toUpperCase() == item.item.toUpperCase())?(mode)?'secondary darken-1':'primary darken-3':''"
              color="white"
          >
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
  props: [
      'mode'
  ],
  data: () => ({
    drawer: true,
    selectedItem: 1,
    drawer_items: [
      {'item': 'Dashboard', 'icon': 'mdi-view-dashboard', 'to': '/dashboard'},
      {'item': 'Appointments', 'icon': 'mdi-calendar-check', 'to': '/appointments'},
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
    metaRoute(){
      return this.$route.fullPath.split('/')[1]
    },
    logo() {
      if (this.getRole == 'doctor') {
        return 'https://previews.123rf.com/images/yupiramos/yupiramos1607/yupiramos160705616/59613224-doctor-avatar-profile-isolated-icon-vector-illustration-graphic-.jpg'
      }
      return 'https://cdn1.iconfinder.com/data/icons/avatar-3/512/Secretary-512.png';
    },
    MiniLogo () {
      switch (this.$vuetify.breakpoint.name) {
        case 'md': return true
        case 'lg': return true
        case 'xl': return false
      }
      return true
      // case 'xs': return 12
      // case 'sm': return 12
      // case 'md': return 12

    },
    // Urlchecking(){
    //   if(this.$store.state.navBarTitle.toUpperCase()
    // }
  },
  created() {
    if (this.getRole == 'doctor') {
      this.drawer_items.push({'item': 'Consultations', 'icon': 'mdi-heart-pulse', 'to': '/consultations'});
    }
    this.drawer_items.push({'item': 'statistics', 'icon': 'mdi-chart-areaspline', 'to': '/statistics'},);


  },
}
</script>

<style scoped>
.v-list .v-list-item--active {
  /*background-color: rgb(9, 220, 164) !important;*/

  /*background-color:#02333C !important;*/
  /*color: white !important;;*/
}
</style>