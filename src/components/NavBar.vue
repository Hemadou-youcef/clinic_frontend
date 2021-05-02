<template>
    <div>
      <v-app-bar  app dark>
        <v-app-bar-nav-icon  @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-btn @click="logout">Logout<v-icon right>mdi-account-remove</v-icon></v-btn>
      </v-app-bar>
      <v-navigation-drawer  v-model="drawer"  app>

        <v-list-item class="pa-2">
          <v-spacer></v-spacer>
          <v-list-item-avatar width="80" height="80">
            <v-img
                :src="logo"></v-img>
          </v-list-item-avatar>
          <v-spacer></v-spacer>
        </v-list-item>
        <v-list-item class="pa-2">
          <v-spacer></v-spacer>
          <div></div>
          <v-spacer></v-spacer>
        </v-list-item>
        <v-list-item-group v-model="selectedItem">
          <v-list>
            <v-list-item v-for="item in drawer_items" :key="item.item" link :to="item.to">
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                {{ item.item }}
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-list-item-group>


      </v-navigation-drawer>
    </div>
</template>

<script>
export default {
name: "NavBar",
  data : () => ({
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
      this.axios.post('/logout').then(res => {
        console.log(res)
        localStorage.removeItem('auth')
        this.$store.commit('authenticate' , false)
        this.$router.push(('/login'))
      })
    }
  },
  computed: {
    getRole(){
      return this.$store.state.role;
    },

    logo(){
      if (this.getRole == 'doctor'){
        return 'https://previews.123rf.com/images/yupiramos/yupiramos1607/yupiramos160705616/59613224-doctor-avatar-profile-isolated-icon-vector-illustration-graphic-.jpg'
      }
      return 'https://cdn1.iconfinder.com/data/icons/avatar-3/512/Secretary-512.png';
    }
  },
  created() {

      if (this.getRole == 'doctor'){
            this.drawer_items.push({'item': 'Consultation', 'icon': 'mdi-heart-pulse', 'to': '/consultation'});
      }
  }

}
</script>

<style scoped>

</style>