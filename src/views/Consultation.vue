<template>
  <v-container class="ma-3 mt-2 pa-0 " style="width: auto !important;" fluid>
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
      <span>
          / Consultations
        </span>
    </v-subheader>
    <div v-if="!loadingContents">
      <v-card class="rounded-lg mb-2">
        <v-card-title>
          <v-icon class="mr-2">
            mdi-heart-pulse
          </v-icon>
          Detail Consultation
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              outlined
              v-if="ConsultationInfo.prescription_id == null"
              :to= "`/prescription/${ConsultationInfo.patient.id}/${ConsultationInfo.id}`"
          >
            <v-icon color="primary">
              mdi-file-settings
            </v-icon>
            ADD PRESCRIPTION
          </v-btn>
          <v-btn
              color="primary"
              outlined
              v-if="ConsultationInfo.prescription_id != null"
              @click="viewPrescription"
          >
            <v-icon color="primary">
              mdi-file-settings
            </v-icon>
            VIEW PRESCRIPTION
          </v-btn>
          <v-btn
              color="teal"
              class="ml-2"
              @click="hover = true"
              outlined
          >
            <v-icon color="teal">
              mdi-pencil
            </v-icon>
            Edit
          </v-btn>
          <v-btn
              color="red"
              class="ml-2"
              @click="deleteConsultationDialog = true"
              outlined
          >
            <v-icon color="red">
              mdi-delete-outline
            </v-icon>
            Delete
          </v-btn>
        </v-card-title>

      </v-card>
      <v-row v-if="endLoading">
        <v-col cols="8">
          <v-card class="rounded-lg">
            <v-card-text>
              <v-card-title class="px-0 py-2">
                <v-icon class="mr-2">
                  mdi-clipboard-pulse-outline
                </v-icon>
                Reasons
              </v-card-title>
              <v-chip-group

                  column
                  class="mb-2"
              >
                <v-chip
                    v-for="(motive,index) in ConsultationInfo.motive.split(',')"
                    color="red"
                    style="border-radius: 5px"
                    class="font-weight-bold white--text"
                    :key="index"
                >
                  {{ motive }}
                </v-chip>
              </v-chip-group>
              <v-card-title class="px-0 py-2">
                <v-icon class="mr-2">
                  mdi-emoticon-sick-outline
                </v-icon>
                Detail
              </v-card-title>

              <v-textarea
                  class="mb-5 pa-0 elevation-0 txtArea"
                  color="white"
                  name="input-7-4"
                  :value="ConsultationInfo.detail"
                  solo
                  auto-grow
                  hide-details
                  readonly
                  flat
              ></v-textarea>

              <v-card-title class="px-0 py-2">
                <v-icon class="mr-2">
                  mdi-stethoscope
                </v-icon>
                treatment
              </v-card-title>
              <v-textarea
                  class="mb-5 elevation-0 font-weight-bold txtArea"
                  background-color=" lighten-4"
                  color="white"
                  name="input-7-4"
                  :value="ConsultationInfo.treatment"
                  solo
                  auto-grow
                  hide-details
                  readonly
              ></v-textarea>
              <v-card-title class="pa-0 pt-2">
                <v-icon class="mr-2">
                  mdi-human-male-height
                </v-icon>
                Examinations
              </v-card-title>
              <v-list>
                <v-list-item class="primary rounded-lg font-weight-bold mb-2">
                  <v-list-item-content>
                    <v-list-item-title class="white--text">
                      Examination
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-content>
                    <v-list-item-title class="white--text">
                      result
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item style="border: 2px solid #ccc" class="rounded-lg mb-2" v-for="(exam,index) in extamination" :key="index">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ exam.exam }}
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{ exam.value }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="rounded-lg mb-2">
            <v-card-text class="text-h5 font-weight-bold" style="text-align: center !important">
              Type: {{ ConsultationInfo.type }}
            </v-card-text>
          </v-card>
          <v-card class="rounded-lg mb-2">
            <v-card-title>
              <v-icon class="mr-2">
                mdi-account
              </v-icon>
              Patient info
            </v-card-title>
            <v-card-text>
              <router-link :to="`/patients/${ConsultationInfo.patient.id}`"  style="text-decoration: none;">
                <v-list class="linkPatientAppointment">
                  <v-list-item>
                    <router-link :to="`/patients/${ConsultationInfo.patient.id}`" style="text-decoration: none;">
                      <v-list-item-avatar class="rounded-lg mr-2" size="100">
                        <v-img :src="$store.state.localhost + ConsultationInfo.patient.image"></v-img>
                      </v-list-item-avatar>
                    </router-link>


                    <router-link :to="`/patients/${ConsultationInfo.patient.id}`" style="text-decoration: none;width: 100%">
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold text-h6" style="text-align: center !important;">
                          {{ ConsultationInfo.patient.firstname + ' ' +  ConsultationInfo.patient.lastname}}
                        </v-list-item-title>
                      </v-list-item-content>
                    </router-link>
                  </v-list-item>
                </v-list>
              </router-link>
            </v-card-text>
          </v-card>
          <v-card class="rounded-lg">
            <v-card-title>
              <v-icon class="mr-2">
                mdi-calendar
              </v-icon>
              Appointment info
              <v-spacer></v-spacer>
              <v-btn
                  outlined
                  color="primary"
                  :to="`/appointments/?date=${ConsultationInfo.appointment.date_appointment}&time=${ConsultationInfo.appointment.start_time_appointment}`"
              >
                <v-icon color="primary">
                  mdi-open-in-new
                </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <router-link :to="`/appointments/?date=${ConsultationInfo.appointment.date_appointment}&time=${ConsultationInfo.appointment.start_time_appointment}`" style="text-decoration: none;">
                <v-list class="linkPatientAppointment">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold text-h6" style="text-align: center">
                        {{ ConsultationInfo.appointment.date_appointment + ' ' + ConsultationInfo.appointment.start_time_appointment.substr(0,5) }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </router-link>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-progress-linear
          v-else
          indeterminate
          color="primary darken-2"
      ></v-progress-linear>


      <v-dialog
          v-if="endLoading"
          v-model="hover"
          transition="dialog-bottom-transition"
          max-width="800"
          :scrollable="false"
          @click:outside="closeOverLay(true)"
      >
        <AddConsultation v-if="hover" v-on:ShowSnackBar="ShowSnackBar" v-on:HideOverLay="closeOverLay"
                         :edit="true"
                         :PatientInfo="{id:ConsultationInfo.patient.id,fullName:ConsultationInfo.patient.firstname + ' ' +  ConsultationInfo.patient.lastname}"
                         :AppointmentInfo="{id: ConsultationInfo.appointment.id,text: ConsultationInfo.appointment.date_appointment + ' ' + ConsultationInfo.appointment.start_time_appointment.substr(0,5)}"
                         :motive="ConsultationInfo.motive"
                         :detail="ConsultationInfo.detail"
                         :treatment="ConsultationInfo.treatment"
                         :type="ConsultationInfo.type"
                         :examinations="ConsultationInfo.examination"
                         :id="ConsultationInfo.id"
                         :mode="mode"/>
      </v-dialog>
      <v-dialog width="400" v-model="deleteConsultationDialog">
        <v-card style="overflow: hidden !important;" width="400" height="150">
          <div class="text-caption text-center pt-6 red--text" style="font-size: 16px !important; ">Are you sure you want
            to delete this consultation
          </div>

          <v-card-text>
            <v-row class="mt-5" justify="center">

              <v-spacer></v-spacer>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="deleteConsultation" :loading="deleteLoading" v-on="on" v-bind="attrs" outlined icon large color="red">
                    <v-icon color="red">mdi-check</v-icon>
                  </v-btn>

                </template>
                <span>Are you sure!</span>
              </v-tooltip>

              <v-spacer></v-spacer>
              <v-tooltip bottom>

                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="deleteConsultationDialog = false" v-on="on" v-bind="attrs" outlined icon large color="green">
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
        {{ message }}

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
    </div>







  </v-container>
</template>

<script>

import AddConsultation from "../components/AddConsultation";
import {jsPDF} from "jspdf";
export default {
  name: "Consultation",
  components: {AddConsultation},
  props:[
      "mode"
  ],
  data: ()=>({
    idConsultation: null,
    loadingContents:true,
    endLoading: false,
    hover: false,
    snackbar: false,
    deleteLoading: false,
    deleteConsultationDialog: false,

    message: '',
    snackbarColor: '',

    ConsultationInfo: [],
    extamination: []
  }),
  methods: {
    getConsultationDetail(){

      this.endLoading = false
      this.axios.get(`/consultation/${this.idConsultation}`)
          .then(res => {
            this.ConsultationInfo = res.data
            this.extamination = JSON.parse(this.ConsultationInfo.examination)
            this.endLoading = true
            this.loadingContents = false
          }).catch(err => {
        console.log(err)
      })
    },
    deleteConsultation(){
      this.deleteLoading = true
      this.axios.post(`/consultation/delete`,{id:this.ConsultationInfo.id})
          .then(() => {
            this.ShowSnackBar('consultation deleted','red')
            var This = this
            setTimeout(()=>{This.$router.push({name : 'consultations'})},1000)
          }).catch(err => {
        console.log(err)
      })
    },
    ShowSnackBar(message,color){
      this.snackbar = true
      this.snackbarColor = color
      this.message = message
    },
    closeOverLay(NormalClose){
      this.hover = false;
      if(!NormalClose) this.getConsultationDetail()
    },
    viewPrescription(){
        let medicines= []
        this.axios.get(`/prescription/${this.ConsultationInfo.prescription_id}`).then(res => {
          res.data.forEach(item => {
            medicines.push({name : item.trade_name , dose : item.pivot.dose} )
          })
          this.downloadPDF(medicines)
        }).catch (err => {
          console.log(err)
        })
    },
    downloadPDF(medicines) {
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
      let age = this.getAge(this.ConsultationInfo.patient.birthday)

      doc.text(`Doctor : ${this.$store.state.user.firstname}  ${this.$store.state.user.lastname}`, 20, 50)
      doc.text(`Patient name : ${this.ConsultationInfo.patient.firstname} ${this.ConsultationInfo.patient.lastname}`, 20, 70)
      doc.text(`Age : ${age}`, 20, 80)
      doc.text(`Date : ${today}`, 220, 70)
      doc.setFontSize(30)
      doc.text(`Medicines list `, 115, 100)
      var y = 105;
      doc.setFontSize(25)

      medicines.forEach(item => {
        y += 15
        doc.text(`${item.name}       ${item.dose}`, 105, y)
      })

      doc.save(`${this.ConsultationInfo.patient.firstname}-${this.ConsultationInfo.patient.lastname}-${this.$route.params.id}`)
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
    }
  },
  created() {
    this.idConsultation = this.$route.params.id
    this.getConsultationDetail()
  }
}
</script>

<style scoped>
  .txtArea {
    outline: 1px solid black !important;
  }
  .linkPatientAppointment:hover{
    background-color: #cdcdcd !important;
    border-radius: 10px;
  }
</style>
