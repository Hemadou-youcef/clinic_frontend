<template>
  <v-container class="ma-3 mt-2 pa-0 " style="width: auto !important;" fluid>
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
        >
          <v-icon color="primary">
            mdi-file-settings
          </v-icon>
          ADD PRESCRIPTION
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
                class="mb-5 pa-3 elevation-2"
                color="white"
                name="input-7-4"
                label="Detail"
                :value="ConsultationInfo.detail"
                outlined
                auto-grow
                hide-details
                disabled
            ></v-textarea>

            <v-card-title class="px-0 py-2">
              <v-icon class="mr-2">
                mdi-stethoscope
              </v-icon>
              traitement
            </v-card-title>
            <v-textarea
                class="mb-5 elevation-0 rounded-0 font-weight-bold"
                background-color="grey lighten-4"
                color="white"
                name="input-7-4"
                :value="ConsultationInfo.treatment"
                solo
                outlined
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
              <v-list-item class="primary rounded-t-lg font-weight-bold">
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

              <v-list-item style="border-bottom: 2px solid #ccc" class="rounded-b-lg" v-for="(exam,index) in extamination" :key="index">
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
          <v-card-title>
            <v-icon class="mr-2">
              mdi-account
            </v-icon>
            Patient info
          </v-card-title>
          <v-card-text>
            <v-list>
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
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold text-h6" style="text-align: center">
                    {{ ConsultationInfo.appointment.date_appointment + ' ' + ConsultationInfo.appointment.start_time_appointment.substr(0,5) }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
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
  </v-container>
</template>

<script>

import AddConsultation from "../components/AddConsultation";
export default {
  name: "Consultation",
  components: {AddConsultation},
  props:[
      "mode"
  ],
  data: ()=>({
    idConsultation: null,

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
  },
  created() {
    this.idConsultation = this.$route.params.id
    this.getConsultationDetail()
  }
}
</script>

<style scoped>

</style>