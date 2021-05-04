<template>
  <div>


    <v-toolbar height="80" class="pt-5 grey" style="background-color: #070606 !important;">

      <v-row>
        <v-spacer></v-spacer>

        <div class="white--text mb-10 " style="font-size: 1.5em;">

          <v-icon size="50" color="white">mdi-account-edit</v-icon>

        </div>
        <v-spacer></v-spacer>
      </v-row>

    </v-toolbar>
    <v-card class="pa-6">

      <v-card-text class="pt-4">
        <v-row justify="center" class="font-weight-black">
          <div>EDIT PATIENT</div>

        </v-row>
        <div>
          <v-form v-model="valid" ref="form">
            <v-text-field
                :error-messages="formErrors.firstname"
                @focus="formErrors.firstname= ''"
                label="First Name"
                v-model="editForm.firstname"
                :rules="requireField"
                required
                class="mt-1"
            ></v-text-field>

            <v-text-field
                :error-messages="formErrors.lastname"
                @focus="formErrors.lastname= ''"
                label="Last name"
                v-model="editForm.lastname"
                :rules="requireField"
                required
                class="mt-1"
            ></v-text-field>
            <v-row class="mt-2">
              <v-col cols="6">
                <v-combobox
                    :error-messages="formErrors.gender"
                    @focus="formErrors.gender= ''"
                    label="Patient gender"
                    dense
                    :rules="requireField"
                    v-model="editForm.gender"
                    value="male"

                    :items="genders"

                >Gender
                </v-combobox>
              </v-col>
              <v-col cols="6">
                <v-combobox
                    :error-messages="formErrors.bloodType"
                    @focus="formErrors.bloodType= ''"
                    label="Patient blood type"
                    dense
                    :rules="requireField"
                    v-model="editForm.bloodType"


                    :items="bloodType"

                >Gender
                </v-combobox>
              </v-col>
            </v-row>
            <v-text-field
                :error-messages="formErrors.address"
                @focus="formErrors.address= ''"
                label="Address"
                v-model="editForm.address"
                :rules="requireField"
                required
                class="mt-1"
            ></v-text-field>
            <v-text-field
                :error-messages="formErrors.phone"
                @focus="formErrors.phone= ''"
                label="Phone Number"
                v-model="editForm.phone"
                :rules="phoneRules"
                required
                class="mt-1"
            ></v-text-field>

            <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="editForm.birthday"
                transition="scale-transition"
                offset-y
                min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    :error-messages="formErrors.birthday"
                    @focus="formErrors.birthday= ''"
                    v-model="editForm.birthday"
                    label="Birthday"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                  v-model="editForm.birthday"
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
                    @click="$refs.menu.save(editForm.birthday)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>

            <v-text-field
                :error-messages="formErrors.email"
                @focus="formErrors.email= ''"
                label="Email"
                type="email"
                v-model="editForm.email"
                :rules="emailRules"
                required
                class="mt-3"
            ></v-text-field>
            <v-layout justify-space-between>
              <v-spacer></v-spacer>
              <v-btn @click="submit" color="black" :disabled="!valid"
                     :class=" { 'blue darken-4 white--text' : valid, 'disabled': !valid }">
                EDIT PATIENT
                <v-icon color="white" class="pl-2">mdi-plus-box</v-icon>
              </v-btn>

              <v-spacer></v-spacer>

            </v-layout>
          </v-form>
        </div>
      </v-card-text>
    </v-card>

  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {EventBus} from "../plugins/EventBus";

export default {
  name: "Login",

  props: ['patientID'],
  data() {
    return {

      editForm: {
        firstname: '',
        lastname: '',
        password: '',
        phone: '',
        email: '',
        birthday: new Date().toISOString().substr(0, 10),
        gender: '',
        bloodType: '',
        address: ''
      },

      formErrors: [],

      genders: ['male', 'female'],
      bloodType: ['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      valid: false,
      menu: false,
      modal: false,
      requireField: [
        (v) => !!v || 'field is required',
      ],
      phoneRules: [
        (v) => v.length > 4 || 'phone number must have at least 5 numbers'
      ],
      emailRules: [
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.editPatient()
      }
    },



    editPatient() {
      this.axios.post(`/patient/update/${this.editForm.id}`, this.editForm).then(res => {
        console.log('edit patient request')
        console.log(res)
        this.$emit('closeDialog' , 'Patient Updated' );

      }).catch(err => {
        this.formErrors = err.response.data.errors
        console.log(err)
      })
    },



    getPatient(id) {
      this.axios.get(`/patient/${id}`).then(res => {
        console.log('get patient info request')
        console.log(res)

        this.editForm = res.data
      }).catch(err => {
        this.formErrors = err.response.data.errors
        console.log(err)
      })
    },


    clear() {
      this.$refs.form.reset()
    },
  },
  watch: {
    patientID: function (id) {
      this.getPatient(id)
    }
  },
  created() {
    console.log('edit form created')
    this.getPatient(this.patientID)
  }
}
</script>

<style scoped>
</style>