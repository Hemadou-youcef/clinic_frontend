<template>
  <div>
    <v-container fluid fill-height class="loginOverlay">
      <v-layout flex align-center justify-center>
        <v-flex xs12 sm4 elevation-6>
          <v-toolbar height="80" class="pt-5 grey darken-4">
              <v-spacer></v-spacer>


                  <div class="white--text mb-10 " style="font-size: 1.5em;">

                    <v-icon size="50" color="white">mdi-account-arrow-right-outline</v-icon>

                  </div>
              <v-spacer></v-spacer>
          </v-toolbar>
          <v-card>
            <v-card-text class="pt-4">
              <div>
                <v-form v-model="valid" ref="form">
                  <v-text-field
                      prepend-icon="mdi-account"
                      label="Enter your username"
                      v-model="username"
                      :rules="usernameRules"
                      required
                      class="mt-3"
                  ></v-text-field>
                  <v-text-field
                      prepend-icon="mdi-lock"
                      type="password"
                      label="Enter your password"
                      v-model="password"
                      min="8"
                      :rules="passwordRules"
                      required
                      class="mb-3"
                  ></v-text-field>
                  <v-layout justify-space-between>
                    <v-spacer></v-spacer>
                    <v-btn @click="submit" :disabled="!valid"  :class=" { 'blue darken-4 white--text' : valid, 'disabled': !valid }">Login</v-btn>

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
      password: '',
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => v.length > 7 || "password must be greated that 8 characters"
      ],
      username: '',
      usernameRules: [
        (v) => !!v || 'username is required',
      ],
    }
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        console.log('form submited')
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