<template>
  <v-card
      class="mx-auto pa-2 pb-0 px-0"
      max-width="800"

  >
    <v-card-text class="p-2">
      <div>
        <v-form v-model="valid" ref="form">
          <v-list class="my-2 pa-0">
            <v-list-item class="pa-0 font-weight-bold rounded-0" style="text-align: center">
              <v-list-item-content class="pa-0">
                <v-overflow-btn
                    class="my-0"
                    editable
                    hide-details
                    background-color="white"
                    v-model="patientID"
                    :items="PatientList"
                    :rules="requireField"
                    :loading="PatientLoading"
                    :disabled="edit"
                    label="patient"
                >
                </v-overflow-btn>
              </v-list-item-content>
              <v-list-item-content class="pa-0">
                <v-overflow-btn
                    class="my-0"
                    editable
                    hide-details
                    background-color="white"
                    v-model="appointmentID"
                    :items="patientInfo.appointments"
                    :loading="AppointmentLoading"
                    :disabled="edit"
                    label="appointment"
                >
                </v-overflow-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-row>
            <v-col>
              <!--            <v-sheet color="primary" class="pa-2 white&#45;&#45;text font-weight-bold text-h5">-->
              <!--                  <span class="align-self-center">-->
              <!--                    Appointment-->
              <!--                  </span>-->
              <!--            </v-sheet>-->
              <v-sheet class="elevation-0 pa-1 rounded-lg" >

                <v-text-field
                    background-color="white"
                    label="Reasons"
                    hide-details
                    placeholder="Reason1,Reason2,Reason3.."
                    prepend-icon="mdi-clipboard-pulse-outline"
                    class="mb-2"
                    v-model="form.Reason"
                    :rules="requireField"
                    outlined
                ></v-text-field>
                <v-textarea
                    outlined
                    auto-grow
                    clearable
                    hide-details
                    background-color="white"
                    name="input-7-4"
                    label="Detail"
                    prepend-icon="mdi-emoticon-sick-outline"
                    v-model="form.Detail"
                    class="mb-5"
                ></v-textarea>
                <v-textarea
                    outlined
                    auto-grow
                    clearable
                    hide-details
                    background-color="white"
                    name="input-7-4"
                    label="Treatment"
                    prepend-icon="mdi-stethoscope"
                    v-model="form.Treatment"
                    :rules="requireField"
                    class="mb-2"
                ></v-textarea>
              </v-sheet>
            </v-col>
            <v-col>
              <v-select
                  v-model="form.Type"
                  :items="Types"
                  :rules="requireField"
                  label="type"
                  class="mb-2"
                  hide-details
                  solo
              ></v-select>
              <v-sheet class="elevation-1 pa-0 rounded-lg" >
                <v-list class="py-0">
                  <v-list-item class="primary font-weight-bold" style="text-align: center">
                    <v-list-item-content>
                      <v-list-item-title class="white--text text-h6">
                        Examination
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn
                          color="white"
                          @click="Examination.push({exam:'',value:''})"
                          icon>
                        <v-icon color="white">
                          mdi-plus
                        </v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>

                  <v-list-item class="pa-2" v-for="(exam,index) in Examination" :key="index">
                    <v-list-item-content class=" ma-0 pa-1">
                      <v-text-field
                          hide-details
                          placeholder="exam"
                          class="rounded-0"
                          v-model="exam.exam"
                          :rules="requireField"
                          outlined
                      ></v-text-field>
                    </v-list-item-content>

                    <v-list-item-content class="ma-0 pa-1">
                      <v-text-field
                          hide-details
                          placeholder="result"
                          class="rounded-0"
                          v-model="exam.value"
                          :rules="requireField"
                          outlined
                      ></v-text-field>
                    </v-list-item-content>
                    <v-list-item-action class="ma-0 ml-1 fill-height">
                      <v-btn
                          class="fill-height"
                          @click="Examination.splice(index, 1)"
                          color="red">
                        <v-icon color="white">
                          mdi-minus
                        </v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-sheet>

            </v-col>
          </v-row>

          <v-layout justify-space-between>
            <v-spacer></v-spacer>
            <v-btn v-if="!edit" @click="submit(true)" :loading="Submitloading" :disabled="!valid"  :class=" { 'blue darken-1 white--text' : valid, 'disabled': !valid }">
              ADD CONSULTATION
              <v-icon color="white" class="pl-2">mdi-plus-box</v-icon>
            </v-btn>
            <v-btn v-else @click="submit(false)" :loading="Editloading" :disabled="!valid" color="teal darken-2" :class=" { ' white--text' : valid, 'disabled': !valid }">
              EDIT CONSULTATION
              <v-icon color="white" class="pl-2">mdi-pencil</v-icon>
            </v-btn>
            <v-spacer></v-spacer>

          </v-layout>
        </v-form>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "AddAppointment",
  props: [
    'edit','mode','PatientInfo','AppointmentInfo','motive','detail','treatment','type','examinations','id'
  ],
  data:()=>({
    Types: [
        'consultation','surgery','check'
    ],
    PatientList: [],
    patientInfo: {
      appointments: []
    },
    Examination: [],

    patientID: null,
    appointmentID: null,

    PatientLoading: false,
    AppointmentLoading: false,
    Submitloading: false,
    Editloading: false,
    valid: false,

    form: {
      Reason:'',
      Detail: '',
      Examination :'',
      Treatment: '',
      Type: '',
      idPatient: null,
      idAppointment: null,
      id:null
    },

    requireField: [
      (v) => !!v || 'field is required',
    ],
  }),
  watch: {
    patientID (){
      this.getAppointmentInfo()
    },
  },
  methods: {
    submit(add){
      this.form.Examination = JSON.stringify(this.Examination)
      this.form.idPatient = this.patientID
      this.form.idAppointment = this.appointmentID

      if (add){
        this.addConsultation()
      }else{
        this.editConsultation()
      }
    },
    addConsultation(){
      this.Submitloading = true
      this.axios.post('/consultation/add' ,
          this.form,
      ).
      then(res => {
          console.log(res.data)
          this.$emit('HideOverLay')
          this.$emit('ShowSnackBar','consultation Added','primary')
          this.Submitloading = false
      }).catch(err => {
        this.formErrors = err.response.data.errors
        console.log(err)
      })
    },
    editConsultation(){
      this.Editloading = true;
      this.axios.post('/consultation/edit',this.form).then(() => {
        this.Editloading = false;
        this.$emit('HideOverLay')
        this.$emit('ShowSnackBar', 'appointment Edited','green')
      }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )
    },
    getPatients() {
      console.log('patients request')
      this.PatientLoading = true
      this.axios.get(`/patients`)
          .then(res => {
            var This = this
            res.data.data.forEach(function (item) {
              This.PatientList.push({
                text : `${item.firstname} ${item.lastname}`,
                value: item.id
              })
            })
            this.PatientLoading = false
          }).catch(err => {
        console.log(err)
      })
    },
    getAppointmentInfo() {
      this.AppointmentLoading = true
      this.axios.get(`/patient/${this.patientID}?with_appointments=1`).then(res => {
        var This = this
        console.log(res.data.appointments)
        This.patientInfo.appointments = []
        res.data.appointments.forEach(function (item) {
            This.patientInfo.appointments.push({
              text : `${item.date_appointment} ${item.start_time_appointment.substr(0, 5)}`,
              value: item.id
            })
        })
        this.AppointmentLoading = false
      }).catch(err => {
        this.errors = err.response.data
        console.log(err.response)

      })
    },
    orderly(list){
      var NoOrdredList = list
      NoOrdredList.sort(function(a, b) {
        const first_start = a.date.split('-').join('')
        const second_start = b.date.split('-').join('')
        return first_start - second_start;
      });
      return NoOrdredList;
    },
  },
  created() {
    if(!this.edit){
      this.getPatients()
    }else{
      this.form.id = this.id
      this.form.Reason = this.motive
      this.form.Detail = this.detail
      this.form.Treatment = this.treatment
      this.Examination = JSON.parse(this.examinations)
      this.form.Type = this.type
      this.PatientList = [{
        text : this.PatientInfo.fullName,
        value: this.PatientInfo.id
      }]
      this.patientID = this.PatientInfo.id
      this.patientInfo.appointments = [{
        text : this.AppointmentInfo.text,
        value: this.AppointmentInfo.id
      }]
      this.appointmentID = this.AppointmentInfo.id
    }

  }
}
</script>

<style>
.custom-green .v-input--selection-controls__input div {
  color: #009688 !important;
}
</style>