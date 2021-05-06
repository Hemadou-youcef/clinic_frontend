<template>
  <v-app>
    <div id="app"
    >
      <v-toolbar v-if="authenticated"
          :class="{'light-blue darken-4': !darkMode,'white--text': !darkMode}"
          color="#1E1E1E"
          flat
          :dark="darkMode"
      >

        <!--        <div class="logo d-flex align-center">-->
        <!--          <v-img-->
        <!--              alt="Vuetify Logo"-->
        <!--              class="shrink mr-2"-->
        <!--              contain-->
        <!--              src="https://seeklogo.com/images/C/c-programming-language-logo-9B32D017B1-seeklogo.com.png"-->
        <!--              transition="scale-transition"-->
        <!--              width="40"-->

        <!--          />-->
        <!--        </div>-->
        <v-toolbar-title class="pl-2 font-weight-bold">
          <v-icon color="white" large>
            mdi-hospital-building
          </v-icon>
          Clinic Management System
        </v-toolbar-title>


        <v-text-field
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
            class="rounded-0 ml-5 white--text"
            dark
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="ToggleModel" :class="{white: darkMode,'black--text': darkMode}">
          <v-icon>
            {{ (darkMode)? 'mdi-brightness-5':'mdi-brightness-4'}}
          </v-icon>
        </v-btn>
        <v-btn @click="logout" icon dark retain-focus-on-click>
          <v-icon>
            mdi-export
          </v-icon>
        </v-btn>


      </v-toolbar>
      <v-row

          pa-0>
        <v-col :cols="WidthBP" class="md px-0 pb-0" v-if="authenticated">
          <v-card
              :dark="darkMode"
              class="fill-height rounded-0"
          >
            <v-navigation-drawer
                width="100%"
                permanent
            >
              <v-card class="pa-2 pl-4 justify-center rounded-0" style="border: 0px;border-bottom: 2px solid #CCD6DD" outlined>
                <v-row>
                  <v-col cols="3">
                    <v-avatar size="69">
                      <img
                          :src="logo"
                          alt="User"
                      >

                    </v-avatar>
                    <v-btn icon style="margin-top: -30px"
                           @click="(UserInfo)? UserInfo = false: UserInfo = true"
                           class="red"

                    >
                      <v-icon color="white" style="border-radius: 50px" >
                        {{ (UserInfo)? 'mdi-arrow-up-bold-box':'mdi-arrow-down-drop-circle'}}

                      </v-icon>
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-card-title>
                      Dr H.Youcef
                    </v-card-title>
                  </v-col>
                </v-row>
                <!--                <v-expand-transition>-->
                <!--                    <v-card-->
                <!--                        transition="scroll-y-transition"-->
                <!--                        v-if="UserInfo"-->
                <!--                        style="position: absolute;z-index:2;margin-top: -15px"-->
                <!--                        class="white"-->
                <!--                        color="black"-->
                <!--                    >-->
                <!--                      <v-list-item-content class="justify-center pa-0">-->
                <!--                        <h3 align="center" class="pa-2">Dr H.Youcef</h3>-->
                <!--                            <v-divider class="py-2"></v-divider>-->
                <!--                        <v-btn-->
                <!--                            tile-->
                <!--                            class="rounded-0"-->
                <!--                        >-->
                <!--                          <v-icon left>-->
                <!--                            mdi-pencil-->
                <!--                          </v-icon>-->
                <!--                          Edit Account-->
                <!--                        </v-btn>-->
                <!--                          <v-divider class="py-2"></v-divider>-->
                <!--                        <v-btn-->
                <!--                            class="rounded-0"-->
                <!--                        >-->
                <!--                          LOG OUT-->
                <!--                        </v-btn>-->
                <!--                      </v-list-item-content>-->
                <!--                    </v-card>-->
                <!--                </v-expand-transition>-->
              </v-card>

              <v-list class="pt-0">
                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    link
                    :class="{'grey lighten-1': checkCurrentRoute(item.link)}"
                    @click="loadingBetweenLinks(item.link)"
                >
                  <!--                  :to="item.link"-->
                  <v-list-item-icon>
                    <v-icon
                        :color="(darkMode)?'white': (checkCurrentRoute(item.link))? 'white':'black'"
                    >
                      {{ item.icon }}
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title :class="{'white--text' :checkCurrentRoute(item.link)}">
                      {{ item.title }}
                      <v-chip
                          color="red darken-4 white--text"
                          class="ml-0 mr-2 black--text"
                          label
                          small
                      >
                        10
                      </v-chip>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-navigation-drawer>
          </v-card>
        </v-col>
        <v-col
            class="pa-0 fill-height"
            :style="(authenticated)?`background-color:${(darkMode)?'black':'#eef0f6'}`:''"
        >
          <v-progress-linear
              :active="showLoading"
              :indeterminate="showLoading"
              absolute
              top
              color="white accent-4"
          ></v-progress-linear>

          <router-view :darkMode="darkMode"/>
        </v-col>
      </v-row>

    </div>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: function() {
    return {
      darkMode: false,
      visibility: false,
      showLoading: false,
      UserInfo: false,
      screenW : screen.width,
      items: [
        { title: 'Home', icon: 'mdi-view-dashboard',link: '/'},
        { title: 'Appointment', icon: 'mdi-calendar-multiple-check',link: '/agenda'},
        { title: 'Patient', icon: 'mdi-account-supervisor',link: '/patients'},
        { title: 'Medicines', icon: 'mdi-pill',link: '/medicines'},
        { title: 'Statistique', icon: 'mdi-align-vertical-bottom' ,link: '/statistique'},
      ],
    }

  },
  methods: {
    logout() {
      this.axios.post('/logout').then(() => {
        localStorage.removeItem('auth')
        this.$store.commit('authenticate' , false)
        this.$router.push(('/login'))
      })
    },
    loadingBetweenLinks (link){
      if(!this.checkCurrentRoute(link)){
        var ThStat = this;
        this.VueRouter = false;
        this.showLoading = true;

        setTimeout(function (){
          ThStat.TransformingMethod(link)
        },500);
      }
    },
    TransformingMethod (link){
      this.VueRouter = true;
      this.showLoading = false;
      this.$router.push(link);
    },
    checkCurrentRoute(link) {
      if(link.length != 1){
        if(link != '/' + this.$route.name)return false
        return true;
      }else{
        if(this.$route.name != 'Home') return false
        return true
      }

    },
    ToggleModel() {
      if(this.darkMode){
        this.darkMode = false;
        this.style();
      }else{
        this.darkMode = true;
        this.style();
      }

    },style(){
      var darkM = (this.darkMode)?'#1E1E1E':'#01579B'
      document.getElementById('app').style.backgroundColor = darkM;
    }
  },
  computed: {
    authenticated() {
      return  this.$store.state.authenticated;
    },
    getRole(){
      return this.$store.state.role;
    },

    logo(){
      if (this.getRole == 'doctor'){
        return 'https://previews.123rf.com/images/yupiramos/yupiramos1607/yupiramos160705616/59613224-doctor-avatar-profile-isolated-icon-vector-illustration-graphic-.jpg'
      }
      return 'https://cdn1.iconfinder.com/data/icons/avatar-3/512/Secretary-512.png';
    },
    WidthBP () {
      switch (this.$vuetify.breakpoint.name) {
        case 'sm': return '12'
        case 'md': return '3'
        case 'lg': return '2'
        case 'xl': return '2'
      }
      return 12;
    },
  }
  ,
  created() {
    if (this.getRole == 'doctor'){
      this.items.splice( 4,0, { title: 'Consultation', icon: 'mdi-heart-pulse',link: '/Consultation'});
    }

  },

};
</script>

<style>
#app {
  background-color: #01579B;
}
.v-col {

}
</style>
