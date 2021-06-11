<template>
  <div>
    <v-toolbar height="80" class="pt-5 grey" color="secondary">

      <v-row>
        <v-spacer></v-spacer>

        <div class="white--text mb-10 " style="font-size: 1.5em;">

          <v-icon size="50" color="white">mdi-account-plus</v-icon>

        </div>
        <v-spacer></v-spacer>
      </v-row>

    </v-toolbar>
    <v-card class="pa-6">

      <v-card-text class="pt-4">
        <v-row justify="center" class="font-weight-black">
          <div>ADD NEW PATIENT</div>

        </v-row>
        <div>
          <v-form v-model="valid" ref="form">
            <v-text-field
                :error-messages="formErrors.firstname"
                @focus="formErrors.firstname= ''"
                label="First Name"
                v-model="patientForm.firstname"
                :rules="requireField"
                required
                class="mt-1"
            ></v-text-field>

            <v-text-field
                :error-messages="formErrors.lastname"
                @focus="formErrors.lastname= ''"
                label="Last name"
                v-model="patientForm.lastname"
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
                    v-model="patientForm.gender"
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
                    v-model="patientForm.bloodType"


                    :items="bloodType"

                >Gender
                </v-combobox>
              </v-col>
            </v-row>
            <v-text-field
                :error-messages="formErrors.address"
                @focus="formErrors.address= ''"
                label="Address"
                v-model="patientForm.address"
                :rules="requireField"
                required
                class="mt-1"
            ></v-text-field>
            <v-text-field
                :error-messages="formErrors.phone"
                @focus="formErrors.phone= ''"
                label="Phone Number"
                v-model="patientForm.phone"
                :rules="phoneRules"
                required
                class="mt-1"
            ></v-text-field>

            <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="patientForm.birthday"
                transition="scale-transition"
                offset-y
                min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    :error-messages="formErrors.birthday"
                    @focus="formErrors.birthday= ''"
                    v-model="patientForm.birthday"
                    label="Birthday"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                  v-model="patientForm.birthday"
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
                    @click="$refs.menu.save(patientForm.birthday)"
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
                v-model="patientForm.email"
                :rules="emailRules"
                required
                class="mt-3"
            ></v-text-field>

            <v-row class="mb-4">
              <v-col cols="8">
                <v-file-input
                    type="file"
                    show-size
                    accept="image/png, image/jpeg, image/bmp"
                    label="Image (optional)"
                    prepend-icon="mdi-image"
                    v-model="patientImage.image"
                    @change="previewImage"
                >

                </v-file-input>
              </v-col>
              <v-col cols="4">
                <v-img v-show="patientImage.image" style="border-radius: 50px !important;" :src="patientImage.imageURL"
                       width="100" height="100"></v-img>
              </v-col>
            </v-row>

            <v-layout justify-space-between>
              <v-spacer></v-spacer>
              <v-btn @click="submit" color="secondary" :disabled="!valid"
                     :class=" { 'blue darken-4 white--text' : valid, 'disabled': !valid }">
                ADD PATIENT
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
export default {
  name: "Login",

  data() {
    return {

      patientForm: {
        firstname: '',
        lastname: '',
        password: '',
        phone: '',
        email: '',
        birthday: new Date().toISOString().substr(0, 10),
        gender: '',
        bloodType: '',
        address: '',

      },
      patientImage: {
        image: null,
        imageURL: '',
      },
      formErrors: [],

      genders: ['male', 'female'],
      bloodType: ['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      valid: false,
      menu: false,
      modal: false,
      text: `Patient added`,
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

        this.addPatient()

      }
    },
    addPatient() {
      this.axios.post('/patient/create',
          this.patientForm,
      ).then(res => {


        this.snackbar = true;

        if (this.patientImage.imageURL) {
          console.log('there is an image')
          this.updateImage(res.data.id)
        } else {
          this.$emit('closeDialog', 'Patient Added');
        }
        this.clear()
      }).catch(err => {
        console.log(err)
        this.formErrors = err.response.data.errors
        console.log(err)
      })
    }
    ,
    clear() {
      this.$refs.form.reset()
    },
    updateImage(id) {
      let data = new FormData();
      data.append('image', this.patientImage.image)
      this.axios.post(`/image/${id}`, data, {
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        }
      }).then(res => {
        console.log(res)
        this.$emit('closeDialog', 'Patient Added');
      })
    },
    previewImage() {
      console.log(this.patientImage)
      if (this.patientImage.image) {

        this.patientImage.imageURL = URL.createObjectURL(this.patientImage.image)
      } else {
        this.patientImage.imageURL = ''
      }
    }
  },
}
</script>

<style scoped>
</style>
