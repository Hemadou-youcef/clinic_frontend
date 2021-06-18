<template>
  <div class="main">
    <v-container fluid fill-height class="loginOverlay pt-10">
      <v-layout  flex align-center justify-left>
        <div   class="loginBox">
          <v-toolbar  color="secondary" height="120" class="pt-5 grey loginHeader">
            <v-row justify="center" >

              <div class="white--text mb-10 " style="font-size: 1.5em;">
                <v-icon size="50" color="white">mdi-account-arrow-right-outline</v-icon>
              </div>
            </v-row>



          </v-toolbar>
          <v-card class="rounded-0 loginCard">
            <div class="welcome">Welcome back</div>
            <v-card-text class="pt-8">
              <div>
                <div class="caption error--text  text-center" style="font-size: 14px !important;" v-if="errors.UserNotFound">{{errors.UserNotFound[0]}}</div>

                <v-form v-model="valid" ref="form">

                  <v-text-field
                      :error-messages="errors.username"

                      prepend-icon="mdi-account"
                      label="Enter your username"
                      v-model="form.username"
                      :rules="usernameRules"
                      required
                      class="mt-3"
                      @focus="errors.username = ''"
                  ></v-text-field>
                  <v-text-field
                      :error-messages="errors.password"
                      prepend-icon="mdi-lock"
                      type="password"
                      label="Enter your password"
                      v-model="form.password"
                      min="8"
                      :rules="passwordRules"
                      required
                      class="mb-3 mt-6"
                      @focus="errors.password = ''"

                  ></v-text-field>

                  <v-layout justify-space-between>
                    <v-spacer></v-spacer>
                    <v-btn @keyup.enter="submit" outlined @click="submit" :disabled="!valid"   :class=" { 'white--text' : valid, 'disabled': !valid }" class="button mt-4">Login</v-btn>

                    <v-spacer></v-spacer>

                  </v-layout>

                </v-form>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Login",
  data () {
    return {
      valid: false,
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => v.length > 7 || "password must be greated that 8 characters"
      ],

      usernameRules: [
        (v) => !!v || 'username is required',
      ],
      form : {
        username: '',
        password: ''
      },
      errors:[]
    }
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        // eslint-disable-next-line no-unused-vars
        // this.axios.get('/csrf-cookie').then(response => {

          this.axios.post('/login' , this.form).then((res) => {

            localStorage.setItem('auth' , 1 )
            localStorage.setItem('token' , res.data.token)
            localStorage.setItem('role' , res.data.user.role)
            // localStorage.setItem('role' , 'secretary')
            this.axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            this.$store.commit('authenticate' , true)
            this.$store.commit('setRole' , res.data.user.role)
            // this.$store.commit('setRole' , 'secretary')
            this.$store.commit('setworkingStartTime' , 32)
            this.$store.commit('setworkingEndTime' , 36)
            this.$store.commit('setagendaView' , 'custom-daily')

            localStorage.setItem('workingStartTime' , 32 )
            localStorage.setItem('workingEndTime' , 36 )
            localStorage.setItem('agendaView' , 'custom-daily')

            this.$store.dispatch('getUser')
            this.$router.push({name : 'dashboard'})
          }).catch(

              (err) => {
                this.errors = err.response.data.errors
                console.log(err.response.data)
              }

          )
        // });

      }
    },
    clear () {
      this.$refs.form.reset()
    }
  },

}
</script>

<style scoped>
.loginHeader{
  background-color: #0e6f60 !important;
  border-radius: 5px;
}
.welcome{
  text-align: center;
  font-size: 1.7em;

  padding-top: 10px;
  margin-bottom: -20px;
  font-family: "Century Schoolbook";
}
.loginBox{
  margin-top: -60px;
  width: 400px !important;
  border-radius: 20px !important;
}
@media all and (min-width: 1290px) {
  .loginBox{
    margin-left: 200px;
    width: 400px !important;

  }
}
@media all and (min-width: 701px) and (max-width: 1289px)  {

  .loginBox{
    margin: 50px;
    width: 400px !important;

  }
}
@media all and (max-width: 700px)  {
  .loginBox{
    margin: auto;
    width: 95% !important;

  }
  .main{
    background: url("../assets/wallpaper.jpg") no-repeat;
    width: 100%;
    height: 100%;
    background-position: right;
    background-size: contain;
  }
}
.loginCard{
  height: 350px;

}
.main{
  background: url("../assets/wallpaper.jpg") no-repeat;
  width: 100%;
  height: 100%;
  background-position: top;
  background-size: cover;
}
.button{
  background-color: rgba(16,132,116 , 0.8) !important;
}
</style>
