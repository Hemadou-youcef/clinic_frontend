<template>
  <v-container fluid>
    <v-row class="mb-0">
      <v-col>
        <CardInfo :message="`Today Appointments`"
                  :number="appointmentNumber"
                  :icon="`mdi-calendar`"
                  :firstColor="`1976d2`"
                  :secondColor="`33ccff`"/>
      </v-col>
      <v-col>
        <CardInfo :message="`Today Consultations`"
                  :number="consultationsList.length"
                  :icon="`mdi-heart-pulse`"
                  :firstColor="`00cc66`"
                  :secondColor="`66ff33`"/>
      </v-col>
      <v-col>
        <CardInfo :message="`Missed Appointments`"
                  :number="missedAppointment.length"
                  :icon="`mdi-clock-alert`"
                  :firstColor="`ff0000`"
                  :secondColor="`cc0000`"/>
      </v-col>
    </v-row>

    <v-row class="mt-0 pt-0">
      <v-col :cols="12 - heightbreackpoint" class="pt-0">
        <v-card :class="`${(checkedAppointment.length > 0)?'mb-2':'mb-0'}`" color="transparent" elevation="0" >
          <v-list color="transparent" class="white-text ma-0 pa-0" v-if="checkedAppointment.length > 0">

            <AppointmentCard  v-on:ShowSnackBar="ShowSnackBar" v-on:reloadAppointment="getCheckedAppointment" v-for="(appointment) in checkedAppointment" :key="appointment.id + 'C'" :appointment="appointment" :missed="false"/>
            <!--            <v-subheader-->
            <!--                style="cursor: pointer"-->
            <!--                class="font-weight-bold text-lg-h6 red white&#45;&#45;text"-->
            <!--                @click="(showMissed)?showMissed = false:showMissed = true"-->
            <!--                v-if="MissedNumber != 0"-->
            <!--            >-->

            <!--              Missed Appointment Today ({{ MissedNumber }}) {{ (showMissed)?'-':'+'}}-->
            <!--            </v-subheader>-->
            <!--            <v-expand-transition >-->
            <!--              <div v-show="showMissed">-->
            <!--                <AppointmentCard v-on:missedCall="MissedAppointmentNumber" v-on:reloadAppointment="getCheckedAppointment" v-for="appointment in checkedAppointment" :key="appointment.id + 'M'" :appointment="appointment" :missed="true"/>-->
            <!--              </div>-->
            <!--            </v-expand-transition>-->
          </v-list>
        </v-card>
        <v-card class=" rounded-lg">
          <v-sheet

              :color="(mode)?'#00b383':'primary darken-3'"
              class="pa-4 white--text font-weight-bold d-flex flex-row"
          >
            Today consultations
          </v-sheet>

          <v-list v-if="consultationsList.length > 0">
            <router-link v-for="consultation in consultationsList" :key="consultation.consult" :to="(getRole == 'doctor')?`/consultations/${consultation.consult}`:`/patients/${consultation.patient_id}`" style="text-decoration: none;">
              <v-list-item>
                <v-list-item-avatar class="rounded-lg mr-2" size="70" >
                    <v-img :src="$store.state.localhost+ consultation.image"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Consultation of: {{ consultation.patient_firstname + ' ' + consultation.patient_lastname}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </router-link>
          </v-list>
          <v-card-title v-else>No consultation Today</v-card-title>
        </v-card>
      </v-col>
      <v-col :cols="heightbreackpoint" class="pt-0">
        <v-card class="BoxShadowCard mt-0 rounded-lg" elevation="11">
          <v-sheet
              :color="(mode)?'#00b383':'primary darken-3'"
              class="pa-4 white--text font-weight-bold d-flex flex-row"
          >
            <span class="align-self-center">
              Appointments
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

          <v-bottom-navigation
              v-if="!nextAppointmentLoading"
              :value="(showMissed)?1:2"
              color="white"
              :background-color="`${(showMissed)?'red darken-4':(mode)?'#017e5e':'primary darken-4'}`"
              grow
          >
            <v-btn @click="showMissed = false">
              <span>Upcoming</span>

              <v-icon>mdi-calendar-clock</v-icon>
            </v-btn>
            <v-btn @click="showMissed = true">
              <span>Missed</span>
              <v-icon>mdi-clock-alert</v-icon>


            </v-btn>
          </v-bottom-navigation>
          <v-data-table
              :headers="(showMissed)?Missedheaders:Upcomingheaders"
              :items="(showMissed)?missedAppointment:appointmentList"
              :items-per-page="5"
              :class="`elevation-1 ${(showMissed)?'grey lighten-4':''}`"
              disable-sort
              disable-pagination
              hide-default-footer

          >
            <template v-slot:item.image="{ item }">
              <div class="d-flex align-center">
                <router-link :to="`/patients/${item.patient_id}`" style="text-decoration: none;    ;">
                  <img :src="$store.state.localhost+ item.image"
                       width="40"
                       height="40"
                       class="rounded-lg mr-3"
                  >
                </router-link>
              </div>
            </template>
            <template v-slot:item.name="{ item }">
              <div class="d-flex align-center">
                <router-link :to="`/patients/${item.patient_id}`" style="text-decoration: none;    ;">
                  <span style="font-size: 20px">
                    {{ item.patient_firstname + ' ' + item.patient_lastname}}
                  </span>
                </router-link>

              </div>
            </template>

            <template v-slot:item.start="{ item }">
              <span class="font-weight-bold text-lg-h6">{{ item.start.substr(0,5) }}</span>
            </template>
            <template v-slot:item.end="{ item }">
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

            <template v-slot:item.action="{ item }">
              <v-btn
                  v-if="!showMissed"
                  class="rounded-lg white--text"

                  :color="(mode)?'secondary darken-2':'primary darken-2'"
                  :to="`/appointments/?date=${item.date}&time=${item.start.substr(0,5)}`"
                  outlined>
                DETAIL
                <v-icon :color="(mode)?'secondary darken-2':'primary darken-2'">
                  mdi-open-in-new
                </v-icon>
              </v-btn>
              <div v-else>

                <v-tooltip v-if="getRole == 'doctor' && item.has_consultation != 'true'" bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                        v-on="on"
                        color="white"
                        dark
                        class="teal--text opacity-8font-weight-bold"
                        @click="fillForm(item,'check');StatusEditAppointment()"
                        elevation
                        outlined
                    >
                      <v-icon color="teal">
                        mdi-check
                      </v-icon>
                    </v-btn>
                  </template>
                  Attended
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                        v-on="on"
                        color="white"
                        dark
                        class="red--text opacity-8 ml-2"
                        @click="fillForm(item,'missed');deleteConsultationDialog = true;"
                        elevation
                        outlined
                    >
                      <v-icon color="red">
                        mdi-calendar-remove-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  absent
                </v-tooltip>
                <v-tooltip v-if="getRole == 'doctor' && item.has_consultation != 'true'" bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                        v-on="on"
                        color="white"
                        dark
                        class="teal--text opacity-8  font-weight-bold float-right"
                        @click="fillForm(item,'waiting');consultHover = true"
                        v-if="getRole == 'doctor' && item.has_consultation != 'true'"
                        elevation
                        outlined
                    >
                      <v-icon color="teal">
                        mdi-pencil-plus
                      </v-icon>
                    </v-btn>
                  </template>
                  consulte
                </v-tooltip>
              </div>

            </template>

          </v-data-table>

        </v-card>

      </v-col>

    </v-row>
    <!--    <v-row>-->
    <!--      <v-col>-->
    <!--        <v-sheet-->
    <!--            :color="(mode)?'#00b383':'primary darken-3'"-->
    <!--            class="pa-4 white&#45;&#45;text font-weight-bold d-flex flex-row"-->
    <!--        >-->
    <!--          Consultation today-->
    <!--        </v-sheet>-->
    <!--        <v-list>-->
    <!--          <v-list-item>-->
    <!--            <v-list-item-avatar class="rounded-lg mr-2" size="70">-->

    <!--            </v-list-item-avatar>-->
    <!--            <v-list-item-content>-->
    <!--              <v-list-item-title>Consultation of: Youcef Hemadou</v-list-item-title>-->
    <!--            </v-list-item-content>-->
    <!--          </v-list-item>-->
    <!--        </v-list>-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <div>
      <v-dialog
          v-model="hover"
          transition="dialog-bottom-transition"
          max-width="500"
          :scrollable="false"
          @click:outside="closeOverLay(true)"
      >
        <AddAppointment v-if="hover" v-on:ShowSnackBar="ShowSnackBar" v-on:HideOverLay="closeOverLay" :dateApp="dateApp" :timeApp="timeApp" :timeLApp="timeLApp" :appointmentId="``" :color="`teal`"/>
      </v-dialog>
      <v-dialog
          v-model="consultHover"
          transition="dialog-bottom-transition"
          max-width="800"
          :scrollable="false"
          @click:outside="closeOverLay(true)"
      >
        <AddConsultation v-if="consultHover" v-on:ShowSnackBar="ShowSnackBar" v-on:HideOverLay="closeOverLay"
                         :edit="false" :info="true"
                         :PatientInfo="{id:form.patient_id,fullName:''}"
                         :AppointmentInfo="{id: AppointmentForm.id,text: form.date + ' ' + form.start_time}"
                         :mode="mode"/>
      </v-dialog>
      <v-dialog width="400" v-model="deleteConsultationDialog">
        <v-card style="overflow: hidden !important;" width="400" height="150">
          <div class="text-caption text-center pt-6 red--text" style="font-size: 16px !important; ">Are you sure this patient is absent??
          </div>

          <v-card-text>
            <v-row class="mt-5" justify="center">

              <v-spacer></v-spacer>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="StatusEditAppointment" :loading="Deleteloading" v-on="on" v-bind="attrs" outlined icon large color="red">
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
import CardInfo from "../components/CardInfo";
import AppointmentCard from "../components/AppointmentCard";
import AddAppointment from "../components/AddAppointment";
import StatistiqueAppointment from "../components/statistiqueAppointments";
import AddConsultation from "../components/AddConsultation";

export default {
  name: "Dashboard",
  // eslint-disable-next-line vue/no-unused-components
  components: {StatistiqueAppointment, AddAppointment, AppointmentCard, CardInfo, AddConsultation},
  props: [
    'mode'
  ],
  data : () => ({
    appointmentNumber: 0,
    dateApp : '',
    timeApp : '08:00',
    timeLApp : 15,
    color : 'teal darken-1',
    snackbarColor: '',
    message: '',


    showMissed:false,
    hover : false,
    snackbar : false,
    Deleteloading : false,
    revisit : true,
    nextAppointmentLoading: false,
    deleteConsultationDialog:false,
    consultHover: false,

    TakeUpIntervall: '',
    TimeRefresh: '',

    checkedAppointment: [],
    missedAppointment: [],
    appointmentList: [],
    consultationsList: [],


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
    Upcomingheaders: [
      { text: '# ', value: 'image'},
      { text: 'Full Name', value: 'name'},
      { text: 'Start time', value: 'start'},
      { text: 'End time', value: 'end'},
      { text: 'Gender', value: 'patient_gender' },
      { text: 'Type', value: 'type' },
      { text: 'Detail', value: 'action' },
    ],
    Missedheaders: [
      { text: '# ', value: 'image'},
      { text: 'Full Name', value: 'name'},
      { text: 'Start time', value: 'start'},
      { text: 'End time', value: 'end'},
      { text: 'Option', value: 'action' },
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
    getRole() {
      return this.$store.state.role;
    },
  },
  methods:{
    fillForm(appointment,state){
      this.form.patient_id = appointment.patient_id
      this.form.date = appointment.date
      this.form.start_time = appointment.start
      this.form.end_time = appointment.end
      this.form.type = appointment.type
      this.form.state = state

      this.AppointmentForm.id  = appointment.id
    },

    GetTodayAppointment(){
      this.nextAppointmentLoading = true
      var currectTime = new Date()

      currectTime.setHours('00')
      currectTime.setMinutes('00')

      var dateApp = currectTime.getFullYear() + '-' + (currectTime.getMonth() + 1) + '-' + currectTime.getDate();
      var timeApp = currectTime.getHours().toString() + ':' + currectTime.getMinutes().toString();
      this.axios.get('/appointments/range',{
        params: { fromtime : timeApp,
          totime: '24:00',
          fromdate: dateApp,
          todate: dateApp} })
          .then((res) => {
            this.appointmentList = this.orderly(res.data.data)

            this.appointmentNumber = this.appointmentList.length
            this.missedAppointment = []
            this.consultationsList = []
            var This = this
            res.data.data.forEach(function (item){
              if(item.has_consultation == 'true'){
                This.consultationsList.push(item)
              }
            })
            this.appointmentList = this.appointmentList.filter(function(value){
              if(value.state == 'missed' || value.state == 'check') {
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

        var AppointmentFiltred = [];
        for(var i = 0;i < this.appointmentList.length;i++){
          var appointmentStartTime = this.CoverterSimpleDate(this.appointmentList[i].date + ' ' + this.appointmentList[i].start);

          var appointmentEndTime = this.CoverterSimpleDate(this.appointmentList[i].date + ' ' + this.appointmentList[i].end);
          // && currectTime.getTime() < appointmentEndTime.getTime()

          if (currectTime.getTime() >= appointmentStartTime.getTime()
              && currectTime.getTime() < appointmentEndTime.getTime()) {
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
          if (currectTime.getTime() >= appointmentEndTime.getTime()) {
            checkerSameAppointment = false
            for(j = 0;j < this.missedAppointment.length;j++){
              if(this.appointmentList[i].id == this.missedAppointment[j].id){
                checkerSameAppointment = true
              }
            }

            if(!checkerSameAppointment) {
              this.missedAppointment.push(this.appointmentList[i])
              this.missedAppointment = this.orderly(this.missedAppointment)
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

    async StatusEditAppointment(){
      this.snackbar = false
      this.Deleteloading = true
      this.axios.post('/appointment/edit', Object.assign(this.form, this.AppointmentForm)).then( () => {
        var This = this
        this.missedAppointment = this.missedAppointment.filter(function(value){
          if(value.id == This.AppointmentForm.id ) {
            return false
          }
          return true
        });
        this.Deleteloading = false
        this.deleteConsultationDialog = false
        // this.GetTodayAppointment()
      }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )
    },
    AutoRefresh(){
      if(this.$route.name != 'dashboard' ){
        window.clearInterval(this.TimeRefresh)
      }else{
        this.GetTodayAppointment()
      }
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
      this.consultHover = false;
      this.GetTodayAppointment()
    },

  },
  created() {
    this.GetTodayAppointment()
    this.TimeRefresh = setInterval(()=> this.AutoRefresh(), 600000)

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
</style>
