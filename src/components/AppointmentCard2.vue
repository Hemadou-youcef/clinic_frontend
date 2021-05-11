<template>
  <div class="mb-2" style="box-shadow: 0px 0px 1px grey">
    <v-list-item
      v-if="appointment.state != 'check'"
        :class="{' pl-0': CheckReadyTakeUp || type == 'Ready','py-3': !CheckReadyTakeUp && type == 'Waiting'}"
        class="CardInfoSheet">


      <v-sheet v-if="CheckReadyTakeUp && type == 'Waiting'" color="teal lighten-2" height="100" width="50" class="pa-3 d-flex justify-center" >
        <v-icon color="white" x-large>
<!--          {{ AppointmentTimeRemain(appointment.date + ' ' + appointment.start,appointment.date + ' ' + appointment.end)  }}-->
          mdi-chevron-right
        </v-icon>
      </v-sheet>


      <v-list-item-avatar class="rounded-lg" :class="{'mx-3': CheckReadyTakeUp || type == 'Ready'}" size="60">
        <img
            :src="$store.state.localhost+ appointment.image"
        >
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="font-weight-bold white--text">{{ appointment.patient_firstname.toUpperCase() + ' ' + appointment.patient_lastname.toUpperCase()}}</v-list-item-title>
        <v-list-item-subtitle v-if="type == 'Waiting'">
          From {{ appointment.start.substr(0,5) }} To {{ appointment.end.substr(0,5) }}
        </v-list-item-subtitle>
      </v-list-item-content>


      <v-list-item-content v-if="type == `Ready`" class="font-weight-bold">
        <v-list-item-title class="white--text">From {{ appointment.start.substr(0,5) }}</v-list-item-title>
        <v-list-item-title class="white--text">To {{ appointment.end.substr(0,5) }}</v-list-item-title>
      </v-list-item-content>




      <v-list-item-content class="pa-3" v-if="(!CheckReadyTakeUp && type == 'Waiting' )|| type == `Ready`">
        <v-list-item-title>
          <v-chip
              class="ma-2 pl-1 white--text font-weight-bold"
              label
              :color="(appointment.type == 'consult')? 'teal':'primary'"
          >
            <v-icon color="white" class="mr-1">
              mdi-calendar-{{ (appointment.type == 'consult')? 'plus':'refresh' }}
            </v-icon>
            {{ appointment.type }}
          </v-chip>

          <v-chip
              class="ma-2 pl-1 white--text font-weight-bold"
              label
              :color="(appointment.patient_gender == 'male')? 'primary':'pink'"
          >
            <v-icon color="white" class="mr-1">
              mdi-gender-{{ appointment.patient_gender }}
            </v-icon>
            {{ appointment.patient_gender }}
          </v-chip>
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-content v-if="type == 'Ready'">
        <v-progress-circular
            v-if="type == `Ready`"
            :rotate="-90"
            :size="70"
            :width="10"
            :value="time"
            :color="(EndTime)?'red lighten-5':'teal lighten-5'"
        >
          <v-icon :color="(EndTime)?'red lighten-5':'white lighten-5'" large>
            {{ AppointmentTimeRemain(appointment.date + ' ' + appointment.start,appointment.date + ' ' + appointment.end) }}
          </v-icon>
        </v-progress-circular>
      </v-list-item-content>

      <v-list-item-content v-if="type == `Ready`">
        <v-btn
            color="white"
            dark
            class="teal--text opacity-8 mb-2 "
            :loading="CheckLoading"
            @click="CheckAppointement()"
            elevation
        >
          <v-icon color="teal" class="mr-2">
            mdi-check
          </v-icon>
          Check
        </v-btn>
        <v-btn
            color="white"
            dark
            class="blue--text opacity-8"
            @click="addAppointment"
            elevation
        >
          <v-icon color="blue" class="mr-2">
            mdi-calendar-refresh
          </v-icon>
          Revisit
        </v-btn>
      </v-list-item-content>

      <v-list-item-content v-else-if="CheckReadyTakeUp && type == 'Waiting'">
        <v-btn
            :disabled="appointment.state == 'taken'"
            color="transparent"
            darkd
            class="blue--text "
            :loading="TakeUpLoading"
            :style="(appointment.state == 'taken')?'':'border: 2px solid #4caaea !important'"
            @click="TakeUpAppointment(appointment)"
            elevation
        >Take up</v-btn>
      </v-list-item-content>
<!--      v-if="type == 'Waiting' && !CheckReadyTakeUp"-->
      <v-list-item-action >
            <v-btn
                color="transparent"
                dark
                @click="(AppointmentInfo)?AppointmentInfo = false:AppointmentInfo = true"
                class="blue--text"
                elevation
            >
              <v-icon color="blue">
                mdi-dots-vertical
              </v-icon>
            </v-btn>
      </v-list-item-action>

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
    <v-expand-transition>
      <v-card v-if="AppointmentInfo" class="rounded-0">
        <v-list-item
          :class="{' pl-0': CheckReadyTakeUp || type == 'Ready',
          'pb-3': !CheckReadyTakeUp && type == 'Waiting',
          'teal lighten-2':(appointment.type == 'consult'),'blue lighten-2': !(appointment.type == 'consult')}"
      >
        <v-list-item-content class="pa-3">
          <v-list-item-title class="white--text font-weight-bold">
            <v-icon color="white" class="mr-2">
              mdi-phone
            </v-icon>
            {{ appointment.patient_phone }}
          </v-list-item-title>
        </v-list-item-content>


        <!--      <v-list-item-action>-->
        <!--        <v-btn-->
        <!--            color="transparent"-->
        <!--            dark-->
        <!--            class="white&#45;&#45;text "-->
        <!--            :loading="CheckLoading"-->
        <!--            @click="CheckAppointement(appointmentList[0])"-->
        <!--            elevation-->
        <!--        >-->
        <!--          <v-icon color="teal" class="mr-2">-->
        <!--            mdi-check-->
        <!--          </v-icon>-->
        <!--          Edit-->
        <!--        </v-btn>-->
        <!--      </v-list-item-action>-->
        <v-list-item-action>
          <v-btn
              color="transparent"
              dark
              class="white--text "
              @click="MissAppointement"
              :loading="MissLoading"
              elevation
          >
            <v-icon color="white" class="mr-2">
              mdi-calendar-remove-outline
            </v-icon>
            Miss
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      </v-card>
    </v-expand-transition>
  </div>

</template>

<script>
import AddAppointment from "./AddAppointment";
export default {
  name: "AppointmentCard",
  components: {AddAppointment},
  data : () => ({
    time: 100,
    CheckLoading: false,
    MissLoading: false,
    TakeUpLoading: false,
    CheckReadyTakeUp: false,
    AppointmentInfo: false,
    EndTime: false,
    revisit : true,
    hover : false,
    snackbar : false,

    dateApp : '',
    timeApp : '08:00',
    timeLApp : 15,
    color : 'teal darken-1',
    TimeIntervall: '',
    TakeUpIntervall: '',
    snackbarColor: '',
    message: '',

    appointmentList: [],

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
    'appointment','type'
  ],
  computed: {

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
    async TakeUpAppointment(){
      this.fillForm('taken')

      this.TakeUpLoading = true
      this.$emit('skeletonLoader','takeup')

      this.axios.post('/appointment/edit', Object.assign(this.form, this.AppointmentForm)).then( () => {

        this.$emit('reloadAppointment',this.appointment)
        this.TakeUpLoading = false
        this.appointment.state = 'taken'
      }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )
    },
    async CheckAppointement (){
      this.fillForm('check')

      this.CheckLoading = true

      this.axios.post('/appointment/edit', Object.assign(this.form, this.AppointmentForm)).then( () => {
        this.$emit('reloadAppointment',this.appointment)
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
        this.MissLoading = false
      }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )
    },

    AppointmentTimeRemain (Start_Time,End_Time){

      var currectTime = new Date()

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
    CheckTakeUp(){
      if(this.$route.name != 'dashboard' ){
        window.clearInterval(this.TakeUpIntervall)
      }else {
        var currectTime = new Date()

        console.log(currectTime)

        var appointmentStartTime = this.CoverterSimpleDate(this.appointment.date + ' ' + this.appointment.start);
        var appointmentEndTime = this.CoverterSimpleDate(this.appointment.date + ' ' + this.appointment.end);

        if (currectTime.getTime() >= appointmentStartTime.getTime() &&
            currectTime.getTime() < appointmentEndTime.getTime()) {
          this.CheckReadyTakeUp = true
          this.TakeUpAppointment()
        } else {
          this.CheckReadyTakeUp = false
        }
      }
    },
    updateTime () {
      if(this.$route.name != 'dashboard' ){
        window.clearInterval(this.TimeIntervall)
      }else{
        var currectTime = new Date()


        var appointmentStartTime = this.CoverterSimpleDate(this.appointment.date + ' ' + this.appointment.start + ':00');
        var appointmentEndTime = this.CoverterSimpleDate(this.appointment.date + ' ' + this.appointment.end + ':00');

        this.time = 100 - ((currectTime.getTime() - appointmentStartTime.getTime()) * 100) / (appointmentEndTime.getTime() - appointmentStartTime.getTime())

        this.time = Math.round(this.time)

        if(this.time <= 0){
          this.EndTime = true
        }
      }
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
    closeOverLay(NormalClose){
      this.hover = false;
      if(!NormalClose) this.getAppointment()
    },
  },
  created() {

    if(this.type == 'Ready'){
      this.updateTime()
      this.TimeIntervall = setInterval(()=> this.updateTime(),   1000)
    }else {
      this.CheckTakeUp()
      this.TakeUpIntervall = setInterval(()=> this.CheckTakeUp(),1 * 1000)
    }
  }
}
</script>

<style scoped>
.CardInfoSheet{
  background-image: linear-gradient(270deg,#71b280,#134e5e);
}
.opacity-8 {
  opacity: 0.8;
}
</style>