<template>
  <div>
    <v-container fluid fill-height class="loginOverlay">
      <v-layout flex align-center justify-center>
        <v-flex xs12 sm4 elevation-6 class="loginOverlayFlex">
          <v-toolbar height="80" class="pt-5 grey" style="background-color: #0f6674 !important;">
              <v-spacer></v-spacer>


                  <div class="white--text mb-10 " style="font-size: 1.5em;">

                    <v-icon size="50" color="white">mdi-account-plus</v-icon>

                  </div>
              <v-spacer></v-spacer>
          </v-toolbar>
          <v-card>
            <v-card-text class="pt-4">
              <div>
                <v-form v-model="valid" ref="form">
                  <v-text-field
                      label="First Name"
                      v-model="first_name"
                      :rules="requireField"
                      required
                      class="mt-3"
                  ></v-text-field>

                  <v-text-field
                      label="Last name"
                      v-model="last_name"
                      :rules="requireField"
                      required
                      class="mt-3"
                  ></v-text-field>

                  <v-text-field
                      label="Phone Number"
                      v-model="phone"
                      :rules="phoneRules"
                      required
                      class="mt-3"
                  ></v-text-field>

                  <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="date"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                          v-model="date"
                          label="Birthday"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="date"
                        no-title
                        scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                          text
                          color="primary"
                          @click="menu = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                          text
                          color="primary"
                          @click="$refs.menu.save(date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>

                  <v-text-field
                      label="Email"
                      type="email"
                      v-model="email"
                      :rules="emailRules"
                      required
                      class="mt-3"
                  ></v-text-field>
                  <v-layout justify-space-between>
                    <v-spacer></v-spacer>
                    <v-btn @click="submit" color="success" :disabled="!valid"  :class=" { 'blue darken-4 white--text' : valid, 'disabled': !valid }">
                      ADD PATIENT
                      <v-icon color="white" class="pl-2">mdi-plus-box</v-icon>
                    </v-btn>
                    <v-snackbar
                        v-model="snackbar"
                    >
                      {{ text }}

                      <template v-slot:action="{ attrs }">
                        <v-btn
                            color="pink"
                            text
                            v-bind="attrs"
                            @click="snackbar = false"
                        >
                          Close
                        </v-btn>
                      </template>
                    </v-snackbar>
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
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      snackbar: false,
      text: `Patient added`,

      requireField: [

        (v) => !!v || 'name is required',
      ],
      phoneRules: [
        (v) => !isNaN(parseFloat(v)) || 'phone number must be number',
        (v) => v.length == 10 || 'phone number must have 10 characters'
      ],
      emailRules: [
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
        this.clear();
        console.log('form submited')
      }
    },
    clear () {
      this.$refs.form.reset()
    },

  },

}
</script>

<style scoped>

</style>