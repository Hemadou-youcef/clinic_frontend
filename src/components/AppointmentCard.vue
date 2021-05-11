<template>
  <div class="mb-2" v-if="(missed && EndTime) || (!missed && !EndTime)">

    <v-list-item
        v-if="appointment"
        class=" pa-2 px-5 py-0 pl-0 rounded-lg elevation-3 lighten-5"
        :class="{'opacity-8': EndTime,'teal':appointment.type == 'consult','primary' : appointment.type == 'revisit'}"
    >

      <v-sheet
          v-if="EndTime"
          color="red"
          height="120"
          width="50"
          class="pa-3 d-flex justify-center fill-height"
      >
        <v-icon color="white">
          mdi-clock-alert
        </v-icon>

      </v-sheet>
      <v-sheet :color="(appointment.type == 'consult')? 'teal':'primary'"
               height="120"
               width="50"
               class="pa-3 mr-2 d-flex justify-center fill-height "
      >
        <span style="writing-mode: vertical-rl;text-align: center" class="font-weight-bold white--text text-lg-h6">
          {{ appointment.type.toUpperCase() }}
        </span>
      </v-sheet>

      <v-list-item-avatar class="rounded-lg mr-2" size="70">
        <img
            :src="$store.state.localhost+ appointment.image"
        >
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="font-weight-bold" style="color: #071a26">{{ appointment.patient_firstname.toUpperCase() + ' ' + appointment.patient_lastname.toUpperCase()}}</v-list-item-title>
        <v-list-item-subtitle class="font-weight-bold" style="color: #2d3748">
          From {{ appointment.start.substr(0,5) }} To {{ appointment.end.substr(0,5) }}
        </v-list-item-subtitle>
        <v-list-item-subtitle class="font-weight-bold" style="color: #2d3748">
          <v-chip
              :style="`border:2px solid ${(appointment.patient_gender == 'male')? '#2196f3':'#e91e63'}`"
              :class="`${(appointment.patient_gender == 'male')? 'primary':'pink'}--text rounded-lg pl-1`"
              outlined
          >
            <v-icon :color="(appointment.patient_gender == 'male')? 'primary':'pink'" class="mr-1">
              mdi-gender-{{ appointment.patient_gender }}
            </v-icon>
            <span class="font-weight-bold">
              {{ appointment.patient_gender }}
            </span>
          </v-chip>
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-content class="pa-3">
        <v-list-item-title class="font-weight-bold"  style="color: #2d3748">
          <v-icon color="primary" class="mr-2">
            mdi-phone
          </v-icon>
          {{ appointment.patient_phone }}
        </v-list-item-title>
<!--        <v-list-item-subtitle class="font-weight-bold" style="color: #2d3748">-->
<!--          <v-chip-->
<!--              class="ma-2 pl-1 white&#45;&#45;text font-weight-bold"-->
<!--              color="red"-->
<!--              label-->
<!--          >-->
<!--            <v-icon color="white" class="mr-1">-->
<!--              mdi-water-->
<!--            </v-icon>-->
<!--            {{ appointment.patient_bloodType }}-->
<!--          </v-chip>-->
<!--        </v-list-item-subtitle>-->
      </v-list-item-content>

      <v-list-item-content class="mx-2">
        <v-btn
            color="white"
            height="80"
            dark
            class="teal--text opacity-8 text-lg-h5 font-weight-bold"
            :loading="CheckLoading"
            elevation
            outlined
        >
          <v-icon color="teal" class="mr-2" size="30">
            mdi-pencil-plus
          </v-icon>
          Consulte
        </v-btn>
      </v-list-item-content>

      <v-list-item-content>
        <v-btn
            color="white"
            dark
            class="red--text opacity-8 mb-2 "
            :loading="MissLoading"
            @click="MissAppointement()"
            elevation
            outlined
        >
          <v-icon color="red" class="mr-2">
            mdi-calendar-remove-outline
          </v-icon>
          absent
        </v-btn>
        <v-btn
            color="white"
            dark
            class="blue--text opacity-8"
            @click="addAppointment"
            elevation
            outlined
        >
          <v-icon color="blue" class="mr-2">
            mdi-calendar-refresh
          </v-icon>
          Revisit
        </v-btn>
      </v-list-item-content>

      <v-list-item-content class="mx-2" v-if="EndTime">
        <v-btn
            color="white"
            height="80"
            dark
            class="teal--text opacity-8 text-lg-h5 font-weight-bold"
            :loading="CheckLoading"
            @click="CheckAppointement()"
            elevation
            outlined
        >
          <v-icon color="teal" class="mr-2" size="30">
            mdi-check
          </v-icon>
          Attended
        </v-btn>
      </v-list-item-content>

      <div class="mx-5" v-if="!EndTime">
        <v-progress-circular
            :rotate="-90"
            :size="90"
            :width="15"
            :value="time"
            :color="(EndTime)?'red':'primary'"
        >
          <v-icon :color="(EndTime)?'red':'primary'" large>
            {{ AppointmentTimeRemain(appointment.date + ' ' + appointment.start,appointment.date + ' ' + appointment.end) }}
          </v-icon>
        </v-progress-circular>
      </div>

    </v-list-item>
    <div>
      <v-dialog
          v-model="hover"
          transition="dialog-bottom-transition"
          max-width="500"
          :scrollable="false"
          @click:outside="closeOverLay(true)"
      >
        <AddAppointment v-if="hover" v-on:ShowSnackBar="ShowSnackBar" v-on:HideOverLay="closeOverLay" :dateApp="dateApp" :timeApp="timeApp" :timeLApp="timeLApp" :revisitApp="revisit" :patientId="form.patient_id" :appointmentId="``" :color="color"/>
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

  </div>

</template>

<script>
import AddAppointment from "./AddAppointment";
export default {
  name: "AppointmentCard",
  components: {AddAppointment},
  data : () => ({
    time: 100,
    dateApp : '',
    timeApp : '08:00',
    timeLApp : 15,
    color : 'teal darken-1',
    snackbarColor: '',
    message: '',

    CurrentTimeAppointment: false,
    EndTime: false,
    hover : false,
    snackbar : false,
    CheckLoading: false,
    MissLoading: false,
    revisit : true,

    TimeIntervall: '',

    form : {
      patient_id: '',
      date: '',
      start_time: '',
      end_time: '',
      type: '',
      state: '',
    },
    AppointmentForm : {
      id: '',
      confirme: 'yes'
    },
  }),
  props: [
    'appointment','missed'
  ],
  computed: {
    heightbreackpoint () {
      switch (this.$vuetify.breakpoint.name) {
        case 'md': return false
        case 'lg': return true
        case 'xl': return true
      }
      return false
      // case 'xs': return 12
      // case 'sm': return 12
      // case 'md': return 12

    },
  },
  methods: {
    fillForm(state){
      this.form.patient_id = this.appointment.patient_id
      this.form.date = this.appointment.date
      this.form.start_time = this.appointment.start
      this.form.end_time = this.appointment.end
      this.form.type = this.appointment.type
      this.form.state = state

      this.AppointmentForm.id  = this.appointment.id
    },

    async CheckAppointement(){
      this.fillForm('check')

      this.CheckLoading = true

      this.axios.post('/appointment/edit', Object.assign(this.form, this.AppointmentForm)).then( () => {
        this.$emit('reloadAppointment',this.appointment)
        this.$emit('missedCall',true)
        this.CheckLoading = false
      }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )
    },
    async MissAppointement (){
      this.fillForm('miss')

      this.MissLoading = true

      this.axios.post('/appointment/edit', Object.assign(this.form, this.AppointmentForm)).then( (res) => {
        this.appointment.state = 'check'
        console.log(res)
        this.$emit('reloadAppointment',this.appointment)
        if(this.EndTime) this.$emit('missedCall',true)

        this.MissLoading = false
      }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )
    },
    async updateTime () {
      if(this.$route.name != 'dashboard' ){
        window.clearInterval(this.TimeIntervall)
      }else{
        var currectTime = new Date()
        currectTime.setHours(10)

        var appointmentStartTime = this.CoverterSimpleDate(await this.appointment.date + ' ' + await this.appointment.start + ':00');
        var appointmentEndTime = this.CoverterSimpleDate(await this.appointment.date + ' ' + await this.appointment.end + ':00');
        this.time = 100 - ((currectTime.getTime() - appointmentStartTime.getTime()) * 100) / (appointmentEndTime.getTime() - appointmentStartTime.getTime())

        this.time = Math.round(this.time)

        if(this.time <= 0){

          this.EndTime = true
          if((this.missed && this.EndTime)){
            this.$emit('missedCall')
          }
          if(!this.missed && this.CurrentTimeAppointment){
            this.CheckAppointement()
            this.this.CurrentTimeAppointment = false
          }
          window.clearInterval(this.TimeIntervall)
        }else {
          if(!this.missed && !this.EndTime){
            this.CurrentTimeAppointment = true
          }
        }
      }
    },
    AppointmentTimeRemain (Start_Time,End_Time){

      var currectTime = new Date()
      currectTime.setHours(10)

      var appointmentStartTime = this.CoverterSimpleDate(Start_Time);
      var appointmentEndTime = this.CoverterSimpleDate(End_Time);

      var unitAppointment = (appointmentEndTime.getTime() - appointmentStartTime.getTime()) / 6
      for(var i = 6;i > 0;i--){
        if(currectTime.getTime() <= (appointmentStartTime.getTime() + (unitAppointment * i))
            &&
            currectTime.getTime() >= (appointmentStartTime.getTime() + (unitAppointment * (i - 1)))){
          if(i == 6 && currectTime.getTime() >= (appointmentStartTime.getTime() + (unitAppointment * i))) return 'mdi-hexagon-outline'
          return 'mdi-hexagon-slice-' + (7 - i);

        }
      }

      return 'mdi-hexagon-outline'
    },
    CoverterSimpleDate(sdate){
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
    addAppointment (){
      this.fillForm('Ready')
      this.dateApp = this.appointment.date
      this.timeApp = '08:00'
      this.timeLApp = 15
      this.color = 'teal darken-1'
      this.hover = true
    },
    ShowSnackBar(message,color){
      this.snackbar = true
      this.snackbarColor = color
      this.message = message
    },
    closeOverLay(){
      this.hover = false;
      this.$emit('reloadAppointment',this.appointment)
    },
  },
  created() {
      this.updateTime()
      this.TimeIntervall = setInterval(()=> this.updateTime(),   1000)

  }
}
</script>

<style scoped>
/*.CardInfoSheet{*/
/*  !*background-image: linear-gradient(270deg,#71b280,#134e5e);*!*/
/*  background-color: #ffffff*/
/*}*/
.opacity-8 {
  opacity: 0.9;
}
.opacity-8:hover{
  opacity: 1;
}
</style>