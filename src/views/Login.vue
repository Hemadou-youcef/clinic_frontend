<template>
  <div>
    <v-container fluid fill-height class="loginOverlay pt-10">
      <v-layout flex align-center justify-center>
        <v-flex xs12 md6 sm8 elevation-6>
          <v-toolbar color="secondary" height="80" class="pt-5 grey ">
              <v-spacer></v-spacer>


                  <div class="white--text mb-10 " style="font-size: 1.5em;">

                    <v-icon size="50" color="white">mdi-account-arrow-right-outline</v-icon>

                  </div>
              <v-spacer></v-spacer>
          </v-toolbar>
          <v-card class="rounded-0">
            <v-card-text class="pt-4">
              <div>
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
                      class="mb-3"
                      @focus="errors.password = ''"

                  ></v-text-field>
                  <div class="caption error--text ml-3" v-if="errors.UserNotFound">{{errors.UserNotFound[0]}}</div>

                  <v-layout justify-space-between>
                    <v-spacer></v-spacer>
                    <v-btn @keyup.enter="submit" @click="submit" :disabled="!valid" color="secondary"  :class=" { 'white--text' : valid, 'disabled': !valid }">Login</v-btn>

                    <v-spacer></v-spacer>

                  </v-layout>
                </v-form>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
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
        this.axios.get('/csrf-cookie').then(response => {

          this.axios.post('/login' , this.form).then((res) => {
            console.log('login request')
            console.log(res.data)
            localStorage.setItem('auth' , 1 )
            localStorage.setItem('role' , res.data.role)
            this.$store.commit('authenticate' , true)
            this.$store.commit('setRole' , res.data.role)
            this.$store.dispatch('getUser')
            this.$router.push({name : 'appointments'})
          }).catch(

              (err) => {
                this.errors = err.response.data.errors
                console.log('login errors')
                console.log(err.response.data)
              }

          )
        });

      }
    },
    clear () {
      this.$refs.form.reset()
    }
  },

}
</script>

<style scoped>

</style>