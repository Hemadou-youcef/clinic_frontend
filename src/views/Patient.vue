<template>
  <div>
    <v-container fluid>
      <v-progress-linear
          indeterminate
          color="green lighten-2"
          v-if="loadingContents"
      ></v-progress-linear>
      <v-subheader>
        <router-link :to="`/dashboard`" style="text-decoration: none;    ;">
          <v-icon :color="`${(mode)?'#017e5e':'primary darken-4'}`" class="mr-2">
            mdi-home
          </v-icon>
        </router-link>
        <router-link :to="`/patients`" style="text-decoration: none;    ;">
        <span class="mr-2">
          / Patients
        </span>
        </router-link>
        <span>
          / Patient / {{ patientInfo.firstname }}  {{ patientInfo.lastname }}
        </span>
      </v-subheader>
      <v-tabs v-if="!loadingContents" centered grow>
        <v-tabs-slider></v-tabs-slider>
        <v-tab>info</v-tab>
        <v-tab-item>
          <v-card class="pa-8">
            <v-row justify="center">

              <v-col class="mt-4" cols="12" sm="12" md="4" lg="4" xl="4">

                <v-row justify="center" align="center" class="pa-3">
                  <v-col cols="4">
                    <v-row justify="center">

                      <v-img aspect-ratio="1.6" width="200" height="200" min-width="200" min-height="200"
                             :src="$store.state.localhost+ patientInfo.image"></v-img>
                    </v-row>

                  </v-col>


                </v-row>
                <v-row justify="center">
                  <v-spacer></v-spacer>
                  <v-col cols="2" class="text-center">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click=" showEditForm( patientInfo.id) " v-bind="attrs" v-on="on" color="#09dca4"
                               outlined
                               size="30" icon>
                          <v-icon color="#09dca4">mdi-account-edit</v-icon>
                        </v-btn>
                      </template>
                      <span>Edit Patient</span>
                    </v-tooltip>
                  </v-col>

                  <v-col cols="2" class="text-center">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="showDeleteConfirmationDialog" v-bind="attrs" v-on="on" color="red"
                               outlined size="30" icon>
                          <v-icon color="red">mdi-account-remove</v-icon>
                        </v-btn>
                      </template>
                      <span>Delete Patient</span>
                    </v-tooltip>
                  </v-col>
                  <v-spacer></v-spacer>
                </v-row>

              </v-col>


              <v-col style="text-align: center !important;" cols="12" xs="12" sm="12" md="8" lg="8" xl="8">
                <v-row justify="center" align="center" class="pt-3">
                  <v-col cols="5">
                    <div class=" text--lighten-2 text-caption">Firstname</div>
                  </v-col>
                  <v-col cols="7">{{ patientInfo.firstname }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row justify="center" align="center" class="pt-3">
                  <v-col cols="5">
                    <div class=" text--lighten-2 text-caption">Lastname</div>
                  </v-col>
                  <v-col cols="7">{{ patientInfo.lastname }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row justify="center" align="center" class="pt-3">
                  <v-col cols="5">
                    <div class=" text--lighten-2 text-caption">Birthday</div>
                  </v-col>
                  <v-col cols="7">{{ patientInfo.birthday }}</v-col>
                </v-row>

                <v-divider></v-divider>
                <v-row justify="center" align="center" class="pt-3">
                  <v-col cols="5">
                    <div class=" text--lighten-2 text-caption">Gender</div>
                  </v-col>
                  <v-col cols="7">{{ patientInfo.gender }}</v-col>
                </v-row>

                <v-divider></v-divider>
                <v-row justify="center" align="center" class="pt-3">
                  <v-col cols="5">
                    <div class=" text--lighten-2 text-caption">Address</div>
                  </v-col>
                  <v-col cols="7">{{ patientInfo.address }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row justify="center" align="center" class="pt-3">
                  <v-col cols="5">
                    <div class=" text--lighten-2 text-caption">Phone-number</div>
                  </v-col>
                  <v-col cols="7">{{ patientInfo.phone }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row justify="center" align="center" class="pt-3">
                  <v-col cols="5">
                    <div class=" text--lighten-2 text-caption">Email</div>
                  </v-col>
                  <v-col cols="7">{{ patientInfo.email }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row justify="center" align="center" class="pt-3">
                  <v-col cols="5">
                    <div class=" text--lighten-2 text-caption">Blood type</div>
                  </v-col>
                  <v-col cols="7">{{ patientInfo.bloodType }}</v-col>
                </v-row>


              </v-col>

            </v-row>
          </v-card>

        </v-tab-item>


        <v-tab>appointments</v-tab>
        <v-tab-item>
          <v-row justify="center" class="my-4">
            <v-col cols="10">
              <v-sheet class="d-flex justify-end ma-3 ">
                <v-btn
                    :color="(mode)?'secondary darken-2':'primary darken-2'"
                    @click="addAppointment"
                    outlined
                >
                  <v-icon color="primary">
                    mdi-plus
                  </v-icon>
                  ADD
                </v-btn>
              </v-sheet>
              <div class="text-center py-5" v-if="appointments.items.length == 0">No appointments yet</div>
              <v-data-table
                  :headers="appointments.headers"
                  :items="appointments.items"
                  hide-default-footer

                  class="elevation-1"
              >
                <template v-slot:item.state="{ item }">
                  <v-chip
                      :color="getColor(item.state)"
                      dark
                  >
                    {{ item.state }}
                  </v-chip>
                </template>
                <template v-slot:item.type="{ item }">
                  <v-chip
                      :color="getColor(item.type)"
                      dark
                  >
                    {{ item.type }}
                  </v-chip>
                </template>
                <template v-slot:item.link="{ item }">
                  <v-btn
                      :to="`/appointments/?date=${item.link.split(' ')[0]}&time=${item.link.split(' ')[1]}`"
                      outlined
                      :color="(mode)?'secondary darken-2':'primary darken-2'"
                  >
                    <v-icon :color="(mode)?'secondary darken-2':'primary darken-2'">
                      mdi-open-in-new
                    </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>

        </v-tab-item>


        <v-tab>Consultation</v-tab>
        <v-tab-item>
          <div class="text-center py-5" v-if="consultations.items.length == 0">No appointments yet</div>
          <v-data-table
              :headers="consultations.headers"
              :items="consultations.items"
              hide-default-footer

              class="elevation-1 my-5"
          >
            <template v-slot:item.syndromes="{ item }">
              <v-chip
                  color="red"
                  dark
              >
                {{ item.syndroms }}
              </v-chip>
            </template>
            <template v-slot:item.type="{ item }">
              <v-chip
                  :color="getColor(item.type)"
                  dark
              >
                {{ item.type }}
              </v-chip>
            </template>
            <template v-slot:item.details="{ item }">
              <v-btn
                  :to="`/consultations/${item.details}`"
                  outlined
                  :color="(mode)?'secondary darken-2':'primary darken-2'"
              >
                <v-icon :color="(mode)?'secondary darken-2':'primary darken-2'">
                  mdi-open-in-new
                </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-tab-item>

      </v-tabs>


    </v-container>


    <!-----------------------------------------    Dialogs --------------------------------------------------->

    <v-dialog width="500" v-model="editPatientDialog">
      <edit-patient
          :patientID="patientInfo.id"
          button-label="EDIT PATIENT"
          method="edit"
          @closeDialog="closeDialog"></edit-patient>
    </v-dialog>

    <v-dialog width="400" v-model="deletePatientDialog">
      <v-card style="overflow: hidden !important;" width="400" height="150">
        <div class="text-caption text-center pt-6 red--text" style="font-size: 16px !important; ">Are you sure you want
          to delete this patient
        </div>

        <v-card-text>
          <v-row class="mt-5" justify="center">

            <v-spacer></v-spacer>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="deletePatient" v-on="on" v-bind="attrs" outlined icon large color="red">
                  <v-icon color="red">mdi-check</v-icon>
                </v-btn>

              </template>
              <span>Are you sure!</span>
            </v-tooltip>

            <v-spacer></v-spacer>
            <v-tooltip bottom>

              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="deletePatientDialog = false" v-on="on" v-bind="attrs" outlined icon large color="green">
                  <v-icon color="green">mdi-close</v-icon>
                </v-btn>

              </template>
              <span>Cancel</span>

            </v-tooltip>

            <v-spacer></v-spacer>

          </v-row>
        </v-card-text>


      </v-card>
    </v-dialog>
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
    <!--    -->
    <div>
      <v-dialog
          v-model="hover"
          transition="dialog-bottom-transition"
          max-width="500"
          :scrollable="false"
          @click:outside="closeOverLay(true)"
      >
        <AddAppointment v-if="hover" @ShowSnackBar="showSnackBar(message,color)" :HideOverLay="closeOverLay"
                        :dateApp="dateApp" :timeApp="timeApp" :timeLApp="timeLApp" :revisitApp="revisit"
                        :patientId="patientInfo.id" :appointmentId="``" :color="color"/>
      </v-dialog>

    </div>

    <v-dialog width="400" v-model="deletePatientDialog">
      <v-card style="overflow: hidden !important;" width="400" height="150">
        <div class="text-caption text-center pt-6 red--text" style="font-size: 16px !important; ">Are you sure you want
          to delete this patient
        </div>

        <v-card-text>
          <v-row class="mt-5" justify="center">

            <v-spacer></v-spacer>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="deletePatient" v-on="on" v-bind="attrs" outlined icon large color="red">
                  <v-icon color="red">mdi-check</v-icon>
                </v-btn>

              </template>
              <span>Are you sure!</span>
            </v-tooltip>

            <v-spacer></v-spacer>
            <v-tooltip bottom>

              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="deletePatientDialog = false" v-on="on" v-bind="attrs" outlined icon large color="green">
                  <v-icon color="green">mdi-close</v-icon>
                </v-btn>

              </template>
              <span>Cancel</span>

            </v-tooltip>

            <v-spacer></v-spacer>

          </v-row>
        </v-card-text>


      </v-card>
    </v-dialog>
    <!-----------------------------------------    Dialogs --------------------------------------------------->


  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import EditPatient from "../components/EditPatient";
import AddAppointment from "../components/AddAppointment";

export default {
  components: {
    AddAppointment,
    'edit-patient': EditPatient
  },
  name: "Patient",
  props: [
    'mode'
  ],
  data: () => ({
    loadingContents: true,
    patientId: null,
    patientInfo: {
      appointments: [],
      consultations: []
    },
    errors: {},
    editPatientDialog: false,
    deletePatientDialog: false,

    snackbar: false,
    snackbarApp: false,
    hover: false,
    revisit: true,
    snackbarMessage: '',
    dateApp: '',
    timeApp: '08:00',
    timeLApp: 15,
    color: 'teal darken-1',
    snackbarColor: '',
    message: '',

    appointments: {
      headers: [
        {
          text: 'Date',
          align: 'center',
          sortable: false,
          value: 'date',
        },
        {
          align: 'center',
          text: 'Start time',
          sortable: false,
          value: 'start_time',
        },
        {
          text: 'End time',
          sortable: false,
          value: 'end_time',
          align: 'center',

        },
        {
          text: 'type',
          sortable: false,
          value: 'type',
          align: 'center',

        },
        {
          text: 'State',
          sortable: false,
          value: 'state',
          align: 'center',

        },
        {
          text: 'Link',
          sortable: false,
          value: 'link',
          align: 'center',
        },
      ],
      items: []
    },

    consultations: {
      headers: [
        {
          text: 'Date & Time',
          align: 'center',
          sortable: false,
          value: 'date',
        },
        {
          align: 'center',
          text: 'Syndromes',
          sortable: false,
          value: 'syndromes',
        },
        {
          text: 'type',
          sortable: false,
          value: 'type',
          align: 'center',

        },
        {
          text: 'Details',
          sortable: false,
          value: 'details',
          align: 'center',
        },
      ],
      items: []
    },

  }),
  methods: {
    // eslint-disable-next-line no-unused-vars

    closeDialog(message) {

      this.editPatientDialog = false
      this.getPatientInfo()
      this.showSnackBar(message)
    },

    showEditForm(patientId) {

      this.editPatientID = patientId
      this.editPatientDialog = true

    },
    showSnackBar(message, color) {
      console.log(`${message}  ${color}`)
      this.snackbarMessage = message
      this.snackbarColor = color
      this.snackbar = true
    },
    showDeleteConfirmationDialog() {

      this.deletePatientDialog = true
    },
    deletePatient() {
      this.axios.post(`/patient/delete/${this.patientInfo.id}`)
          // eslint-disable-next-line no-unused-vars
          .then(res => {
            console.log('deleting user ' + this.patientInfo.id);
            this.deletePatientDialog = false

            this.showSnackBar('Patient Deleted', 'red')
            this.$router.push({name: 'patients'})

          })
          .catch(err => {
            console.log(err)
          })
    },
    getPatientInfo() {

      this.axios.get(`/patient/${this.patientId}?with_appointments=1`).then(res => {
        this.appointments.items = []
        this.patientInfo = res.data
        this.patientInfo.appointments.map(item => {
          this.appointments.items.push({
            date: `${item.date_appointment}`,
            start_time: item.start_time_appointment,
            end_time: item.end_time_appointment,
            type: item.type_appointment,
            state: item.state_appointment,
            link: `${item.date_appointment} ${item.start_time_appointment}`
          })
        })
        this.appointments.items = this.orderly(this.appointments.items)

        this.patientInfo.consultations.forEach(item => {
          this.consultations.items.push({
            date : `${item.created_at.slice(0,10)}   ${item.created_at.slice(11,19)} `,
            syndroms : item.motive.split(',')[0],
            type : item.type ,
            details: item.id
          })
        })
        console.log(this.consultations.items)

        this.loadingContents = false
      }).catch(err => {
        console.log(err)
        this.errors = err.response.data
        console.log(err.response)

      })
    },
    getColor(state) {

      if (state == 'consult' || state == 'check') {
        return 'blue'
      } else if (state == 'revisit') {
        return 'teal'
      }

      if (state == 'waiting' || state == 'surgery') {
        return 'orange'
      } else if (state == 'missed' ) {
        return 'red'
      } else {
        return 'green'
      }
    },
    CoverterSimpleDate(sdate) {
      var date = new Date();
      var FDArray = sdate.split(' ')
      var DateArray = FDArray[0].split('-')
      date.setFullYear(parseInt(DateArray[0]))
      date.setMonth(parseInt(DateArray[1]) - 1)
      date.setDate(parseInt(DateArray[2]))
      var TimeArray = FDArray[1].split(':')
      date.setHours(TimeArray[0])
      date.setMinutes(TimeArray[1])
      date.setSeconds(TimeArray[2])
      return date;
    },
    orderly(list) {
      var NoOrdredList = list
      NoOrdredList.sort(function (a, b) {
        const first_start = a.date.split('-').join('')
        const second_start = b.date.split('-').join('')
        return first_start - second_start;
      });
      return NoOrdredList;
    },
    addAppointment() {
      var currectTime = new Date()
      var dateApp = currectTime.getFullYear() + '-' + (currectTime.getMonth() + 1) + '-' + currectTime.getDate();

      this.dateApp = dateApp
      this.timeApp = '08:00'
      this.timeLApp = 15
      this.color = 'teal darken-1'
      this.hover = true
    },

    closeOverLay() {
      this.hover = false
      this.getPatientInfo()
    },
  },
  created() {

    this.patientId = this.$route.params.id
    this.getPatientInfo()
  }
}
</script>

<style scoped>

.v-divider {
  margin-top: 8px;
}

.text-caption {
  font-size: 16px !important;
  font-weight: 450 !important;
}

img {
  width: 200px !important;
  height: 200px !important;
}
</style>
