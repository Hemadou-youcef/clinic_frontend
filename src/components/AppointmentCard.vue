<template>
  <div class="mb-2 rounded-lg" :class="{'mt-6':EndTime}" v-if="showAppointement">
    <div v-if="(!missed)" >
      <v-sheet
          :color="`${(appointment.type == 'consult')?'#00b383':'primary darken-5'}`"
          class="pa-4 white--text font-weight-bold d-flex flex-row rounded-t-lg"
      >
<!--        :color="`${(appointment.type == 'consult')?'#00b383':'primary darken-5'}`"-->
<!--        :color="`${(appointment.type == 'consult')?(progressDarken)?'#037e5d':'#00b383':(progressDarken)?'primary darken-3':'primary darken-5'}`"-->
        <v-icon v-if="EndTime" color="white">
          mdi-clock-check
        </v-icon>
        <span class="align-self-center">
          {{ (EndTime)?'Past':'Current'}} Appointment
        </span>
        <v-spacer></v-spacer>

        <v-btn v-if="EndTime" class="white" style="margin-top: -30px;margin-right: -30px" color="black" @click="showAppointement = false" small icon>
          <v-icon color="black" small>
            mdi-close
          </v-icon>
        </v-btn>

<!--        <v-progress-linear-->
<!--            v-else-->
<!--            indeterminate-->
<!--            color="cyan"-->
<!--        ></v-progress-linear>-->
      </v-sheet>
      <v-progress-linear
          v-if="false"
          v-model="time"
          :color="`${(appointment.type == 'consult')? 'teal':'primary'}`"
          class="rounded-lg"
          height="40"
          striped
      >
        <template v-slot:default="">
          <div class="d-flex justify-start pl-4" style="width: 100%">
            <span class="align-self-center font-weight-bold white--text">
              Current Appointment
            </span>
          </div>
        </template>
      </v-progress-linear>

      <v-card
          :color="`${(appointment.type == 'consult')?'teal lighten-5':'primary lighten-5'}`"
          class="black--text ma-0 rounded-b-lg rounded-t-0"
          style="border: 2px solid grey"
      >
        <v-progress-circular
            style="float: right;margin-top: -40px;position: absolute;right: 5px;top:-10px"
            v-if="!EndTime"
            :rotate="-90"
            :size="40"
            :width="20"
            :value="time"
            :color="`${(time <= 15)?(progressDarken)?'red lighten-2':'red':(appointment.type == 'consult')?(progressDarken)?'#037e5d':'#00b383':(progressDarken)?'primary darken-3':'primary darken-5'}`"
        >

        </v-progress-circular>
        <div class="d-flex flex-no-wrap justify-space-around">
          <router-link :to="`/patients/${appointment.patient_id}`" style="text-decoration: none;    ;">
            <v-avatar
                class="ma-3 rounded-lg"
                size="125"
                style="border:2px solid grey"
            >

              <v-img :src="$store.state.localhost+ appointment.image"></v-img>
            </v-avatar>
          </router-link>
          <div>
              <v-card-title
                  class="text-h5 font-weight-bold"
              >
                <router-link :to="`/patients/${appointment.patient_id}`" style="text-decoration: none;">
                  {{ appointment.patient_firstname.toUpperCase() + ' ' + appointment.patient_lastname.toUpperCase()}}
                </router-link>
              </v-card-title>
            <v-card-subtitle class="grey--text  font-weight-bold">
              From {{ appointment.start.substr(0,5) }} To {{ appointment.end.substr(0,5) }}
            </v-card-subtitle>

            <v-btn
                color="white"
                dark
                class="teal--text opacity-8  font-weight-bold"
                :loading="CheckLoading"
                elevation
                outlined
            >
              <v-icon color="teal" class="mr-2" >
                mdi-pencil-plus
              </v-icon>
              Consulte
            </v-btn>
            <v-btn
                style="float: right"
                icon
                @click="CurrentAppointmentInfoShow = !CurrentAppointmentInfoShow"
            >
              <v-icon color="black">{{ CurrentAppointmentInfoShow ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </div>
        </div>
        <v-card-subtitle>
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

          <v-chip :color="(appointment.type == 'consult')? 'teal':'primary'" class="white--text rounded-lg pl-1 ml-2">
            <v-icon color="white" class="mr-1">
              mdi-calendar-{{ (appointment.type == 'consult')? 'plus':'refresh' }}
            </v-icon>
            <span class="font-weight-bold">
                  {{ appointment.type }}
                </span>
          </v-chip>
          <span  v-if="!this.EndTime" class="black--text font-weight-bold" style="float: right;font-size: 30px">
            {{ AppointmentTimeRemain(appointment.date + ' ' + appointment.start,appointment.date + ' ' + appointment.end) }}
          </span>


        </v-card-subtitle>

        <!--        <v-card-actions class="d-flex align-end">-->

        <!--          <v-spacer></v-spacer>-->
        <!--          <v-btn-->
        <!--              icon-->
        <!--              @click="CurrentAppointmentInfoShow = !CurrentAppointmentInfoShow"-->
        <!--          >-->
        <!--            <v-icon color="black">{{ CurrentAppointmentInfoShow ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>-->
        <!--          </v-btn>-->
        <!--        </v-card-actions>-->

        <v-expand-transition>
          <div v-show="CurrentAppointmentInfoShow">
            <v-divider></v-divider>
            <v-list color="white">
              <v-list-item >
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold"  style="color: #645d54">
                    Phone number:
                    <v-icon color="primary" class="ml-1">
                      mdi-phone
                    </v-icon>
                    {{ appointment.patient_phone }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold" style="color: #645d54">
                    Blood type:
                    <v-chip color="red" class="white--text rounded-lg pl-1">
                      <v-icon color="white" class="mr-1">
                        mdi-water
                      </v-icon>
                      <span class="font-weight-bold">
                      {{ appointment.patient_bloodType }}
                    </span>
                    </v-chip>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold" style="color: #645d54">
                    Address:
                    <v-icon color="black" class="ml-1 pb-2">
                      mdi-map-marker
                    </v-icon>
                    <span class="font-weight-bold">
                      {{ appointment.patient_address }}
                    </span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="mr-2">
                  <v-btn
                      color="#3f51b5"
                      class="white--text"
                      :to="`/appointments/?date=${appointment.date}&time=${appointment.start.substr(0,5)}`"
                      elevation
                  >
                    <v-icon color="white" class="mr-2">
                      mdi-alert-circle-outline
                    </v-icon>
                    DETAIL
                  </v-btn>
                </v-list-item-content>
                <v-list-item-content class="mr-2">
                  <v-btn
                      color="red"
                      dark
                      class="white--text opacity-8"
                      :loading="MissLoading"
                      @click="MissAppointement()"
                      elevation
                  >
                    <v-icon color="white" class="mr-2">
                      mdi-calendar-remove-outline
                    </v-icon>
                    absent
                  </v-btn>
                </v-list-item-content>
                <v-list-item-content>
                  <v-btn
                      color="blue"
                      dark
                      class="white--text opacity-8"
                      @click="addAppointment"
                      elevation
                  >
                    <v-icon color="white" class="mr-2">
                      mdi-calendar-refresh
                    </v-icon>
                    Revisit
                  </v-btn>
                </v-list-item-content>
              </v-list-item>
            </v-list>

          </div>
        </v-expand-transition>

      </v-card>
    </div>
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
              class="white--text "
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

    showAppointement: true,
    CurrentTimeAppointment: false,
    CurrentAppointmentInfoShow: false,
    progressDarken: false,
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
    'appointment','missed','mode'
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
        // this.$emit('reloadAppointment',this.appointment)
        this.CheckLoading = false
      }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )
    },
    async MissAppointement (){
      this.fillForm('missed')

      this.MissLoading = true

      this.axios.post('/appointment/edit', Object.assign(this.form, this.AppointmentForm)).then( () => {
        this.appointment.state = 'missed'
        this.$emit('reloadAppointment',this.appointment)

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

        var appointmentStartTime = this.CoverterSimpleDate(await this.appointment.date + ' ' + await this.appointment.start + ':00');
        var appointmentEndTime = this.CoverterSimpleDate(await this.appointment.date + ' ' + await this.appointment.end + ':00');
        this.time = 100 - ((currectTime.getTime() - appointmentStartTime.getTime()) * 100) / (appointmentEndTime.getTime() - appointmentStartTime.getTime())

        this.time = Math.round(this.time)

        if(this.time <= 0){

          this.EndTime = true
          this.CheckAppointement()
          window.clearInterval(this.TimeIntervall)
        }else {
          this.progressDarken = !this.progressDarken
          if(!this.missed && !this.EndTime){
            this.CurrentTimeAppointment = true
          }
        }

      }
    },
    AppointmentTimeRemain (Start_Time,End_Time){

      var currectTime = new Date()

      // var appointmentStartTime = this.CoverterSimpleDate(Start_Time);
      var appointmentEndTime = this.CoverterSimpleDate(End_Time);
      var timeremain =((appointmentEndTime.getTime() - currectTime.getTime()) / (1000))
      var getHour =  (parseInt(timeremain) / 3600).toString().split('.')
      var getMinute = (parseFloat('0.' + getHour[1]) * 60).toString().split('.')
      return this.TimeDesign(getHour[0] + ':' +  getMinute[0])

      // var getSecond = (parseFloat('0.' + getMinute[1]) * 60).toString().split('.')
      // return this.TimeDesign(getHour[0] + ':' +  getMinute[0] + ':' + getSecond[0])
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
    TimeDesign (time){
      var TimeArray = time.split(':')
      if(TimeArray[0].length == 1) TimeArray[0] = '0' + TimeArray[0].toString()
      if(TimeArray[1].length == 1) TimeArray[1] = '0' + TimeArray[1].toString()
      return TimeArray.join(':')
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

<style>
/*.CardInfoSheet{*/
/*  !*background-image: linear-gradient(270deg,#71b280,#134e5e);*!*/
/*  background-color: #ffffff*/
/*}*/
.v-progress-circular__underlay{
  stroke:rgb(236, 240, 244);
}
</style>