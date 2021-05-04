<template>
  <div>
    <v-container>

      <v-card class="pa-4">
        <v-card-title class="text-center text-h4">Patients list</v-card-title>

        <v-text-field
            prepend-inner-icon="mdi-account-search"
            filled
            label="Search patient"
            clearable
        ></v-text-field>

        <!--       Patients Pagination-->
        <div v-if="pagination.pagesCount" class="text-center mb-8">
          <v-pagination
              :disabled="loadingButton"
              color="#09dca4"
              v-model="pagination.currentPage"
              :length="pagination.pagesCount"
          ></v-pagination>
        </div>
        <div class="text-center pb-5">
          <v-btn
              :loading="loadingButton"
              :disabled="loadingButton"
              v-show="loadingButton"
              color="blue-grey"
              class="ma-2 white--text"
              fab
              @click="loader = 'loading5'"
          >
            <v-icon dark>
              mdi-cloud-upload
            </v-icon>
          </v-btn>
        </div>

        <v-row justify="center" align="center">
          <v-col xs="12" sm="6" md="4" lg="3" xl="2" v-for="patient_info in patientsList" :key="patient_info.id">
            <patient-card @confirmDialog="showDeleteConfirmationDialog($event)" @showEditForm="showEditForm($event)" :patient-info="patient_info"></patient-card>
          </v-col>
        </v-row>

      </v-card>


      <v-dialog

          width="500"
          v-model="addPatientDialog"

      >
        <template v-slot:activator="{ on : dialog  ,attr }">
          <v-tooltip left>
            <template v-slot:activator="{on : tooltip }">
              <v-fab-transition>
                <v-btn v-bind="attr" v-on="{...dialog , ...tooltip}" color="blue" dark fab fixed bottom right>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-fab-transition>
            </template>
            <span>Add Patient</span>
          </v-tooltip>
        </template>

        <add-patient patientForm="editPatientForm" buttonLabel="ADD PATIENT" label="Add new patient" method="create"
                     @closeDialog="closeDialog"></add-patient>

      </v-dialog>

      <v-dialog width="500" v-model="editPatientDialog">
        <edit-patient
            :patientID="editPatientID"
            button-label="EDIT PATIENT"
            method="edit"
            @closeDialog="closeDialog"></edit-patient>
      </v-dialog>

      <v-dialog width="400" v-model="deletePatientDialog">
        <v-card style="overflow: hidden !important;"  width="400" height="150">
            <div class="text-caption text-center pt-6 red--text" style="font-size: 16px !important; ">Are you sure you want to delete this patient</div>

          <v-card-text>
            <v-row  class="mt-5" justify="center" >

            <v-spacer></v-spacer>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="deletePatient" v-on="on" v-bind="attrs" outlined icon large color="red"  ><v-icon color="red">mdi-check</v-icon></v-btn>

                </template>
                <span>Are you sure!</span>
              </v-tooltip>

              <v-spacer></v-spacer>
              <v-tooltip bottom>

              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="deletePatientDialog = false" v-on="on" v-bind="attrs" outlined icon large color="green"  ><v-icon color="green">mdi-close</v-icon></v-btn>

              </template>
              <span>Cancel</span>

              </v-tooltip>

              <v-spacer></v-spacer>

            </v-row>
          </v-card-text>



        </v-card>
      </v-dialog>

      <div v-if="pagination.pagesCount" class="text-center mt-3">
        <v-pagination
            :disabled="loadingButton"
            color="#09dca4"
            v-model="pagination.currentPage"
            :length="pagination.pagesCount"
        ></v-pagination>
      </div>

      <v-snackbar
          v-model="snackbar"
      >
        {{ snackbarMessage }}

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


    </v-container>
  </div>
</template>

<script>
import PatientCard from "../components/PatientCard";
import AddPatient from "../components/AddPatient";
import EditPatient from "../components/EditPatient";
// eslint-disable-next-line no-unused-vars
import {EventBus} from "../plugins/EventBus";

export default {
  components: {
    'patient-card': PatientCard,
    // eslint-disable-next-line vue/no-unused-components
    'add-patient': AddPatient,
    'edit-patient': EditPatient

  },
  name: "Patient",
  data: () => ({

    patientsList: [],


    editPatientForm: {},
    editPatientID: 0,
    pagination: {
      currentPage: 1,
      pagesCount: 0,
    },
    loadingButton: false,
    addPatientDialog: false,
    editPatientDialog: false,
    deletePatientDialog: false,
    deletePatientId : null,
    snackbar: false,
    snackbarMessage: ''


  }),
  watch: {
    'pagination.currentPage': function (newPage, oldPage) {
      console.log('page changed from ' + oldPage + 'to  ' + newPage)
      this.getPatients(newPage)
    },

  },
  methods: {
    getPatients(page = 1) {
      console.log('patients request')
      this.loadingButton = true
      this.axios.get(`/patients?page=${page}`)
          .then(res => {

            this.pagination.currentPage = res.data.current_page
            this.pagination.pagesCount = res.data.last_page
            // res.data.data.map(el => {
            //   console.log( Date(el.birthday) )
            // })
            this.patientsList = res.data.data
            this.loadingButton = false
          })
    },

    closeDialog(message) {

      this.addPatientDialog = false
      this.editPatientDialog = false
      this.getPatients()
      this.showSnackBar(message)
    },

    showEditForm(patientId) {

      this.editPatientID = patientId
      this.editPatientDialog = true

    },
    showSnackBar(message) {
      this.snackbarMessage = message
      this.snackbar = true
    },
    showDeleteConfirmationDialog(id){
      console.log('trying to delete user with id ' + id)
      this.deletePatientId = id
      this.deletePatientDialog = true
    },
    deletePatient(){
      this.axios.post(`/patient/delete/${this.deletePatientId}`)
      .then(res => {
        console.log('deleting user '+ this.deletePatientId);
        console.log(res)
        this.deletePatientDialog= false

        this.showSnackBar('Patient Deleted')
        this.getPatients()

      })
      .catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    console.log('patients componenct created then get patients')
    this.getPatients()
  },
  updated() {
  },
  computed: {}


}
</script>

<style scoped>

</style>