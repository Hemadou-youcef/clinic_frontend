<template>
  <div>
    <v-container fluid>
      <v-subheader>
        <router-link :to="`/dashboard`" style="text-decoration: none;">
          <v-icon color="green" class="mr-2">
            mdi-home
          </v-icon>
        </router-link>
        <span>
          / <router-link :to="`/consultations`" style="text-decoration: none;">Consultations</router-link> / <router-link :to="`/consultations/${ConsultationInfo.id}`">Consultation #{{ConsultationInfo.id}}</router-link> / Prescription
        </span>
      </v-subheader>
      <v-row justify="center">
        <v-col cols="12" lg="8">
          <v-card class="pa-4">

            <v-card-title>Enter prescription medicines</v-card-title>
            <v-row>
              <v-col>
                <div  class="ml-4 text-caption">Consultation Id #{{ConsultationInfo.id}}  </div>
                <div class="ml-4 text-caption">Patient: {{patientInfo.firstname}} {{patientInfo.lastname}} </div>

              </v-col>
              <v-spacer></v-spacer>
              <v-col >

                <v-btn color="green" outlined @click="addMedicineDialog=true">ADD NEW MEDICINE <v-icon right>mdi-pill</v-icon></v-btn>
              </v-col>
            </v-row>

            <v-row class="px-5" align="center">
              <v-col cols="7">
                <v-overflow-btn

                    editable
                    background-color="white"
                    v-model="selectedMedicine"
                    :items="medicinesNames"
                    :loading="dataLoading"
                    label="Select a medicine"
                    prepend-icon="mdi-pill"
                >
                </v-overflow-btn>
              </v-col>
              <v-col cols="3">
                <v-text-field
                    v-model="selectedMedicineDose"
                    label="Dose"
                ></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-btn @click="addMedicine" rounded outlined color="green">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-list>
              <v-list-item class="py-0 px-2 mb-2 rounded-lg grey lighten-4 elevation-2"
                           style="border: 1px solid #1565c0">

                <v-list-item-content class="ml-3">
                  <v-list-item-title class="font-weight-bold grey--text">
                    Medicine
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold grey--text">
                    Dose
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold grey--text">
                    remove
                  </v-list-item-title>
                </v-list-item-content>


              </v-list-item>


            </v-list>
            <v-list class="" v-for="(medicine, index) in selectedMedicines" :key="index">
              <v-list-item class="lighten-4 elevation-2 justify-center">
                <v-list-item-content>
                  <v-list-item-title>{{ medicine.name }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title>{{ medicine.dose }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-btn outlined color="red" @click="deleteMedicin(index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>


            </v-list>
            <v-row justify="center">
              <v-col cols="8">
                <v-btn :loading="loadingButton" @click="generatePrescription" v-if="selectedMedicines.length> 0"
                       class="mt-5" block outlined>
                  Add prescription
                </v-btn>
              </v-col>

            </v-row>
          </v-card>
        </v-col>

      </v-row>

      <v-snackbar
          :color="snackbarColor"
          v-model="snackbar"
      >
        {{ snackbarMessage }}

        <template v-slot:action="{ attrs }">
          <v-btn
              text
              v-bind="attrs"
              @click="snackbar = false"
              class="white--text"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>

      <!-----------------------------    ADD MEDICINE DIALOG    --------------------------------->
    <v-dialog v-model="addMedicineDialog" width="500">
      <v-card style="overflow: hidden !important;" class="py-6">
        <v-form ref="addMedicineForm" v-model="valid">
          <v-row justify="center" class=" text-center  text-caption" style="background-color: #1bba66 !important;">
            <v-col>
              <div class="white--text " style="font-size: 18px !important;">Add new medicine</div>
            </v-col>
          </v-row>
          <v-row justify="center" class=" px-3">
            <v-col cols="12" sm="10">
              <v-text-field :error-messages="errors.scientific_name" @focus="errors.scientific_name = ''"
                            :rules="requireField" v-model="medicineForm.scientific_name"
                            label="scientific name"></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" class=" px-3">
            <v-col cols="12" sm="10">
              <v-text-field :error-messages="errors.trade_name" @focus="errors.trade_name = ''" :rules="requireField"
                            v-model="medicineForm.trade_name" label="trade name"></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" align="center">
            <v-btn @click="addNewMedicine" :disabled="!valid" color="black" outlined>ADD</v-btn>

          </v-row>
        </v-form>

      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {jsPDF} from "jspdf";

export default {
  name: "Prescription",
  data: () => ({
    medicines: [],
    medicinesNames: [],
    patientInfo: [],
    ConsultationInfo: [],
    loadingButton: false,
    selectedMedicines: [],
    selectedMedicineDose: '',
    dataLoading: true,
    selectedMedicine: '',
    selectedMedicinesModule: true,
    snackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    valid: false,
    medicineForm: {
      scientific_name: '',
      trade_name: ''
    },
    errors: [],
    addMedicineDialog:false,
    requireField: [
      (v) => !!v || 'field is required',
    ],
  }),
  methods: {
    getMedicines() {
      this.dataLoading = true
      this.axios.get('/medicines').then(res => {
        this.medicinesNames = []
        this.medicines = res.data
        res.data.forEach(item => {
          this.medicinesNames.push(item.trade_name)
        })
        this.dataLoading = false
      }).catch(err => {

        console.log(err)
        this.dataLoading = false

      })
    },
    deleteMedicin(index) {

      this.selectedMedicines.splice(index, 1)
    },
    addMedicine() {
      if (this.selectedMedicine && this.selectedMedicineDose) {
        this.selectedMedicines.push({
          name: this.selectedMedicine,
          dose: this.selectedMedicineDose
        })
        this.selectedMedicine = ''
        this.selectedMedicineDose = ''
      }

    },

    getPatientInfo() {
      this.axios.get(`/patient/${this.$route.params.patientId}`).then(res => {

        this.patientInfo = res.data


      }).catch(err => {
        this.errors = err.response.data
        console.log(err.response)

      })
    },
    getConsultationInfo() {
      this.axios.get(`/consultation/${this.$route.params.consultationId}`)
          .then(res => {
            this.ConsultationInfo = res.data
            this.ConsultationInfo.examination = JSON.parse(this.ConsultationInfo.examination)

          }).catch(err => {
        console.log(err)
      })
    },
    generatePrescription() {
      this.loadingButton = true
      let prescription = []
      this.selectedMedicines.forEach(selectedMedicine => {
        this.medicines.forEach(medicine => {
          if (selectedMedicine.name == medicine.trade_name) {
            prescription.push({id: medicine.id, dose: selectedMedicine.dose})
          }
        })
      })

      this.axios.post(`/prescription/add/${this.$route.params.consultationId}`, prescription)
          .then(res => {
        console.log(res)
        this.snackbarMessage = 'Prescription added'
        this.snackbarColor = 'green'
        this.snackbar = true
        this.downloadPDF()
        this.loadingButton = false
        this.$router.push(`/consultations/${this.$route.params.consultationId}`)


      }).catch(err => {

        console.log(err)
        this.loadingButton = false

      })


    },
    downloadPDF() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = mm + '/' + dd + '/' + yyyy;
      let doc = new jsPDF({
        orientation: "landscape",

      });
      doc.setFontSize(40)
      doc.text('Prescription', 110, 30)
      doc.setFontSize(20)
      doc.setFont('normal')
      let age = this.getAge(this.patientInfo.birthday)

      doc.text(`Doctor : ${this.$store.state.user.firstname}  ${this.$store.state.user.lastname}`, 20, 50)
      doc.text(`Patient name : ${this.patientInfo.firstname} ${this.patientInfo.lastname}`, 20, 70)
      doc.text(`Age : ${age}`, 20, 80)
      doc.text(`Date : ${today}`, 220, 70)
      doc.setFontSize(30)
      doc.text(`Medicines list `, 115, 100)
      var y = 105;
      doc.setFontSize(25)

      this.selectedMedicines.forEach(item => {
        y += 15
        doc.text(`${item.name}       ${item.dose}`, 105, y)
      })

      doc.save(`${this.patientInfo.firstname}-${this.patientInfo.lastname}-${this.$route.params.consultationId}`)
    },
    getAge(dateString) {
      var today = new Date();
      var birthDate = new Date(dateString);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    addNewMedicine() {
      this.axios.post('/medicines/add', this.medicineForm)
          // eslint-disable-next-line no-unused-vars
          .then(res => {
            this.$refs.addMedicineForm.reset()
            this.addMedicineDialog = false
            this.getMedicines()

          }).catch(err => {
        console.log(err.response)
        this.errors = err.response.data.errors
      })


    },
  },
  created() {
    this.getPatientInfo()
    this.getConsultationInfo()
    this.getMedicines()
  }
}
</script>

<style scoped>

</style>
