<template>
  <v-container fluid>
    <v-row class="mb-2">
      <v-col>
        <CardInfo :message="`Todays Patients`" :number="43" :icon="`mdi-human-queue`"/>
      </v-col>
      <v-col>
        <CardInfo :message="`Todays Consultation`" :number="23" :icon="`mdi-human-queue`"/>
      </v-col>
      <v-col>
        <CardInfo :message="`Todays Patients`" :number="43" :icon="`mdi-human-queue`"/>
      </v-col>
    </v-row>
    <v-card class="mb-0" color="transparent" flat>
      <v-list color="transparent" class="white-text" v-if="checkedAppointment.length > 0">
        <v-subheader
            class="font-weight-bold text-lg-h6"
        >
          Current Appointment
        </v-subheader>
          <AppointmentCard v-on:missedCall="MissedAppointmentNumber" v-on:reloadAppointment="getCheckedAppointment" v-for="(appointment) in checkedAppointment" :key="appointment.id + 'C'" :appointment="appointment" :missed="false"/>
        <v-subheader
            style="cursor: pointer"
            class="font-weight-bold text-lg-h6"
            @click="(showMissed)?showMissed = false:showMissed = true"
        >
          Missed Appointment Today ({{ MissedNumber }}) {{ (showMissed)?'-':'+'}}
        </v-subheader>
        <v-expand-transition >
          <div v-show="showMissed">
            <AppointmentCard v-on:missedCall="MissedAppointmentNumber" v-on:reloadAppointment="getCheckedAppointment" v-for="appointment in checkedAppointment" :key="appointment.id + 'M'" :appointment="appointment" :missed="true"/>
          </div>
        </v-expand-transition>
      </v-list>
    </v-card>
    <v-row>
      <v-col :cols="heightbreackpoint">
        <v-card class="BoxShadowCard mt-0 rounded-sm">
          <v-sheet
              :color="(mode)?'#00b383':'primary darken-3'"
              class="pa-4 white--text font-weight-bold d-flex flex-row"
          >
            <span class="align-self-center">
              Upcoming Appointment
            </span>
            <v-spacer></v-spacer>
            <v-btn
                color="white"
                class="mr-2"
                :class="(mode)?'secondary darken-2':'primary darken-2'"
                :loading="nextAppointmentLoading"
                @click="GetTodayAppointment"
                icon>
              <v-icon color="white">
                mdi-cached
              </v-icon>
            </v-btn>
            <v-btn
                color="white"
                :class="(mode)?'secondary darken-2':'primary darken-2'"
                @click="addAppointment"
                icon>
              <v-icon color="white">
                mdi-plus
              </v-icon>
            </v-btn>
          </v-sheet>
          <v-data-table
              :headers="headers"
              :items="appointmentList"
              :items-per-page="5"
              class="elevation-1 text-lg-h2"
              disable-sort
              disable-pagination
              hide-default-footer
          >
            <template v-slot:item.name="{ item }">
              <div class="d-flex align-center">
                <img :src="$store.state.localhost+ item.image"
                     width="40"
                     height="40"
                     class="rounded-lg mr-3 patient-avatar"
                >
                <span class="text-lg-h6">
                {{ item.patient_firstname + ' ' + item.patient_lastname}}
                </span>
              </div>
            </template>

            <template v-slot:item.time="{ item }">
              <span class="font-weight-bold text-lg-h6">{{ item.start.substr(0,5) }}</span>

              <span class="font-weight-bold text-lg-h6">-</span>
              <span class="font-weight-bold text-lg-h6">{{ item.end.substr(0,5) }}</span>
            </template>

            <template v-slot:item.patient_gender="{ item }">
              <v-chip
                  :style="`border:2px solid ${(item.patient_gender == 'male')? '#2196f3':'#e91e63'}`"
                  :class="`${(item.patient_gender == 'male')? 'primary':'pink'}--text rounded-lg pl-1`"
                  outlined
              >
                <v-icon :color="(item.patient_gender == 'male')? 'primary':'pink'" class="mr-1">
                  mdi-gender-{{ item.patient_gender }}
                </v-icon>
                <span class="font-weight-bold">
                  {{ item.patient_gender }}
                </span>
              </v-chip>

            </template>

            <template v-slot:item.type="{ item }">
              <v-chip :color="(item.type == 'consult')? 'teal':'primary'" class="white--text rounded-lg pl-1">
                <v-icon color="white" class="mr-1">
                  mdi-calendar-{{ (item.type == 'consult')? 'plus':'refresh' }}
                </v-icon>
                <span class="font-weight-bold">
                  {{ item.type }}
                </span>
              </v-chip>
            </template>

            <template v-slot:item.action="">
              <v-btn class="rounded-lg white--text" color="#3f51b5" elevation>
                DETAIL
              </v-btn>
            </template>

          </v-data-table>

        </v-card>
      </v-col>
      <v-col :cols="12 - heightbreackpoint">
        <v-sheet
            :color="(mode)?'#00b383':'primary darken-3'"
            class="pa-4 white--text font-weight-bold d-flex flex-row"
        >
          Consultation today
        </v-sheet>
        <v-list>
          <v-list-item>
            <v-list-item-avatar class="rounded-lg mr-2" size="70">

            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Consultation of: Youcef Hemadou</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <div>
      <v-dialog
          v-model="hover"
          transition="dialog-bottom-transition"
          max-width="500"
          :scrollable="false"
          @click:outside="closeOverLay(true)"
      >
        <AddAppointment v-if="hover" v-on:ShowSnackBar="ShowSnackBar" v-on:HideOverLay="closeOverLay" :dateApp="dateApp" :timeApp="timeApp" :timeLApp="timeLApp" :appointmentId="``" :color="color"/>
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
import CardInfo from "../components/CardInfo";
import AppointmentCard from "../components/AppointmentCard";
import AddAppointment from "../components/AddAppointment";
export default {
  name: "Dashboard",
  components: {AddAppointment, AppointmentCard, CardInfo},
  props: [
      'mode'
  ],
  data : () => ({
    MissedNumber: 0,
    dateApp : '',
    timeApp : '08:00',
    timeLApp : 15,
    color : 'teal darken-1',
    snackbarColor: '',
    message: '',

    showMissed:false,
    hover : false,
    snackbar : false,
    revisit : true,
    nextAppointmentLoading: false,

    TakeUpIntervall: '',

    checkedAppointment: [],
    appointmentList: [],
    headers: [
      { text: '#  Full Name', value: 'name'},
      { text: 'Time', value: 'time'},
      { text: 'Gender', value: 'patient_gender' },
      { text: 'Type', value: 'type' },
      { text: 'Detail', value: 'action' },
    ],
  }),
  computed: {
    heightbreackpoint () {
      switch (this.$vuetify.breakpoint.name) {
        case 'md': return 12
        case 'lg': return 8
        case 'xl': return 6
      }
      return 12
    // case 'xs': return 12
    // case 'sm': return 12
    // case 'md': return 12

    },
  },
  methods:{
    GetTodayAppointment(){
      this.nextAppointmentLoading = true
      var currectTime = new Date()

      currectTime.setHours('8')
      currectTime.setMinutes('00')

      var dateApp = currectTime.getFullYear() + '-' + (currectTime.getMonth() + 1) + '-' + currectTime.getDate();
      var timeApp = currectTime.getHours().toString() + ':' + currectTime.getMinutes().toString();
      this.axios.get('/appointments/range',{
        params: { fromtime : timeApp,
          totime: '18:00',
          fromdate: dateApp,
          todate: dateApp} })
          .then((res) => {
            this.appointmentList = this.orderly(res.data.data)
            this.appointmentList = this.appointmentList.filter(function(value){
              if(value.state == 'miss' || value.state == 'check') {
                return false
              }
              return true
            });

            this.CheckTakeUp()
            window.clearInterval(this.TakeUpIntervall)
            this.TakeUpIntervall = setInterval(()=> this.CheckTakeUp(),10 * 1000)
            this.nextAppointmentLoading = false
          }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )
    },
    getCheckedAppointment(appointment){
      if(typeof appointment === 'object' && appointment !== null){
        for(var i = 0;i < this.checkedAppointment.length;i++){
          if(this.checkedAppointment[i].id == appointment.id){
            this.checkedAppointment.splice(i, 1)
          }
        }
      }
      this.GetTodayAppointment()
    },
    CheckTakeUp(){
      if(this.$route.name != 'dashboard' ){
        window.clearInterval(this.TakeUpIntervall)
      }else {
        var currectTime = new Date()
        currectTime.setHours(10)
        var AppointmentFiltred = [];
        for(var i = 0;i < this.appointmentList.length;i++){
          var appointmentStartTime = this.CoverterSimpleDate(this.appointmentList[i].date + ' ' + this.appointmentList[i].start);

          // var appointmentEndTime = this.CoverterSimpleDate(this.appointmentList[i].date + ' ' + this.appointmentList[i].end);
          // && currectTime.getTime() < appointmentEndTime.getTime()

          if (currectTime.getTime() >= appointmentStartTime.getTime()) {
            var checkerSameAppointment = false
            for(var j = 0;j < this.checkedAppointment.length;j++){
              if(this.appointmentList[i].id == this.checkedAppointment[j].id){
                checkerSameAppointment = true
              }
            }

            if(!checkerSameAppointment) {
              this.checkedAppointment.push(this.appointmentList[i])
              this.checkedAppointment = this.Reverseorderly(this.checkedAppointment)
            }

            AppointmentFiltred.push(this.appointmentList[i])

          }
        }

          this.appointmentList = this.appointmentList.filter(function(value){
            if(AppointmentFiltred.includes(value)) {
              return false
            }
            return true
          });

      }
    },
    MissedAppointmentNumber(reverse = false){
      if(reverse) this.MissedNumber--
      else this.MissedNumber++
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
    orderly(list){
      var NoOrdredList = list
      NoOrdredList.sort(function(a, b) {
        const first_start = a.start.split(':').join('')
        const second_start = b.start.split(':').join('')
        return first_start - second_start;
      });
      return NoOrdredList;
    },
    Reverseorderly(list){
      var NoOrdredList = list
      NoOrdredList.sort(function(a, b) {
        const first_start = a.start.split(':').join('')
        const second_start = b.start.split(':').join('')
        return second_start - first_start ;
      });
      return NoOrdredList;
    },
    addAppointment (){
      var currectTime = new Date()
      var dateApp = currectTime.getFullYear() + '-' + (currectTime.getMonth() + 1) + '-' + currectTime.getDate();

      this.dateApp = dateApp
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
      this.GetTodayAppointment()
    },

  },
  created() {
    this.GetTodayAppointment()
  }


}
</script>

<style >
/**{*/
/*  background-color: #f5f5f5;*/
/*}*/
  .v-data-table-header {
    background-color: #f5f5f5;
  }
  .v-data-table tbody tr td{
    padding: 10px !important;
  }
  .BoxShadowCard {
    box-shadow: 0px 0px 2px grey
  }
  .patient-avatar {
    outline: 3px solid #a5afb8;
    padding: 2px;
  }
</style>