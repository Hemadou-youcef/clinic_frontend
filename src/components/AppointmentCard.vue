<template>
  <div class="mb-2">
    <div v-if="(!missed)">
      <v-sheet
          :color="`${(appointment.type == 'consult')?(progressDarken)?'#037e5d':'#00b383':(progressDarken)?'primary darken-3':'primary darken-5'}`"
          class="pa-4 white--text font-weight-bold d-flex flex-row"
      >
              <span class="align-self-center">
                Current Appointment
              </span>
        <v-spacer></v-spacer>
        <v-btn v-if="EndTime" color="white" @click="missed = true" outlined icon>
          <v-icon color="white">
            mdi-close
          </v-icon>
        </v-btn>
      </v-sheet>
      <v-card
          color="white"
          class="black--text ma-0"
          dark
          tile
          elevation="11"
      >

        <div class="d-flex flex-no-wrap justify-space-around">
          <v-avatar
              class="ma-3 rounded-lg"
              size="125"
              style="border:2px solid grey"
          >
            <v-img :src="$store.state.localhost+ appointment.image"></v-img>
          </v-avatar>
          <div>
            <v-card-title
                class="text-h5"
            >
              {{ appointment.patient_firstname.toUpperCase() + ' ' + appointment.patient_lastname.toUpperCase()}}
            </v-card-title>

            <v-card-subtitle class="grey--text">
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
          <span  v-if="!this.EndTime" class="black--text" style="float: right;font-size: 30px">
            {{ AppointmentTimeRemain(appointment.date + ' ' + appointment.start,appointment.date + ' ' + appointment.end) }}
          </span>

          <!--          <v-progress-circular-->
          <!--              style="float: right;margin-top: -40px"-->
          <!--              :rotate="-90"-->
          <!--              :size="80"-->
          <!--              :width="15"-->
          <!--              :value="time"-->
          <!--              :color="(EndTime)?'red':'primary'"-->

          <!--          >-->
          <!--          </v-progress-circular>-->
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
            <v-list color="grey lighten-3">
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
                      :loading="MissLoading"
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
      <v-progress-linear
          v-model="time"
          :color="`${(appointment.type == 'consult')? 'teal':'primary'}`"
          height="10"
          stream
          striped
      >
        <!--        <template v-slot:default="">-->
        <!--          {{ AppointmentTimeRemain(appointment.date + ' ' + appointment.start,appointment.date + ' ' + appointment.end) }}-->
        <!--        </template>-->
      </v-progress-linear>
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
        currectTime.setHours('13')

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
      currectTime.setHours('13')

      // var appointmentStartTime = this.CoverterSimpleDate(Start_Time);
      var appointmentEndTime = this.CoverterSimpleDate(End_Time);
      var timeremain =((appointmentEndTime.getTime() - currectTime.getTime()) / (1000))
      var getHour =  (parseInt(timeremain) / 3600).toString().split('.')
      var getMinute = (parseFloat('0.' + getHour[1]) * 60).toString().split('.')
      var getSecond = (parseFloat('0.' + getMinute[1]) * 60).toString().split('.')
      console.log(getHour)
      console.log(getMinute)
      console.log(getSecond)
      console.log(this.TimeDesign(getHour[0] + ':' +  getMinute[0] + ':' + getSecond[0]))
      return this.TimeDesign(getHour[0] + ':' +  getMinute[0] + ':' + getSecond[0])

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
      if(TimeArray[2].length == 1) TimeArray[2] = '0' + TimeArray[2].toString()
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