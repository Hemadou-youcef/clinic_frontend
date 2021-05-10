<template>
  <v-container fluid>


    <v-card class="mb-2" v-if="checkedAppointment.length != 0">

        <v-list class="white--text py-0">
          <v-expand-transition>
            <AppointmentCard v-on:skeletonLoader="SkeletonLoader" v-on:reloadAppointment="getCheckedAppointment" v-for="appointment in checkedAppointment" :key="appointment.id" :appointment="appointment" type="Ready"/>
          </v-expand-transition>
        </v-list>
    </v-card>
    <v-skeleton-loader
        v-if="TakeUpLoading"
        class="my-3"
        type="card-heading,list-item-avatar, divider"
    ></v-skeleton-loader>

    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-sheet>
            <v-list class="white--text pr-0 py-0"  v-if="appointmentList.length > 0">
              <AppointmentCard v-on:skeletonLoader="SkeletonLoader" v-on:reloadAppointment="getCheckedAppointment" v-for="appointment in appointmentList" :key="appointment.id" :appointment="appointment" :type="`Waiting`"/>
            </v-list>
            <v-list v-else class="white--text pr-0 py-0" >
              <v-list-item class="my-2 py-3 grey lighten-3">
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">
                    No Appointment
                  </v-list-item-title>

                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-skeleton-loader
                v-if="UpComingAppointmentLoading"
                class="mb-3"
                type="list-item-avatar-three-line"
            ></v-skeleton-loader>
          </v-sheet>
          <v-sheet class="pa-4 teal white--text font-weight-bold d-flex flex-row">
            <span class="align-self-center">
              Upcoming Appointment
            </span>
            <v-btn v-if="UpComingAppointmentLoading" color="white" class="teal" loading icon>
              <v-icon color="white">
                mdi-plus
              </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                color="white"
                class="teal"
                @click="addAppointment"
                icon>
              <v-icon color="white">
                mdi-plus
              </v-icon>
            </v-btn>
          </v-sheet>
        </v-card>
      </v-col>
      <v-col>
        <v-card>

          <v-sheet>
            <v-list color="#f5f5f5" class="white--text pr-0 py-0">

              <v-list-item class="my-2 py-3 grey lighten-3">

                <v-list-item-avatar>
                  <img
                      src="http://cdn.onlinewebfonts.com/svg/img_237553.png"
                  >
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>Hemadou Youcef</v-list-item-title>
                  <v-list-item-subtitle>
                    Jijel
                  </v-list-item-subtitle>
                </v-list-item-content>

              </v-list-item>
            </v-list>
          </v-sheet>
          <v-sheet class="pa-4 blue darken-2 white--text font-weight-bold">
            <span>
              Today Consultation
            </span>
          </v-sheet>
        </v-card>
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
import AppointmentCard from "../components/AppointmentCard";
import AddAppointment from "../components/AddAppointment";
export default {
  name: "Dashboard",
  components: {AddAppointment, AppointmentCard},
  data : () => ({
    time: 80,

    CheckLoading: false,
    TakeUpLoading: false,
    UpComingAppointmentLoading: false,
    hover : false,
    snackbar : false,

    dateApp : '',
    timeApp : '08:00',
    timeLApp : 15,
    color : 'teal darken-1',
    snackbarColor: '',
    message: '',

    appointmentList: [],
    checkedAppointment: [],
  }),
  methods:{
    SkeletonLoader(type){
      if(type == 'takeup'){
        this.TakeUpLoading = true
      }
    },
    GetTodayAppointment (type){
      if(type != 'delete_load'){
        this.UpComingAppointmentLoading = true
      }
      var Today = new Date()


      var dateApp = Today.getFullYear() + '-' + (Today.getMonth() + 1) + '-' + Today.getDate();
      var timeApp = Today.getHours().toString() + ':' + Today.getMinutes().toString();
      this.axios.get('/appointments/range',{
        params: { fromtime : timeApp,
          totime: '18:00',
          fromdate: dateApp,
          todate: dateApp} })
          .then((res) => {
            this.appointmentList = this.orderly(res.data.data)
            for(var i = 0;i < this.appointmentList.length;i++){
              if(this.appointmentList[i].state == 'taken'){
                var checkerSameAppointment = false

                for(var j = 0;j < this.checkedAppointment.length;j++){
                  if(this.appointmentList[i].id == this.checkedAppointment[j].id){
                    checkerSameAppointment = true
                  }
                }
                if(!checkerSameAppointment) {
                  this.checkedAppointment.push(this.appointmentList[i])
                }
                this.appointmentList.splice(i, 1)
              }else if(this.appointmentList[i].state == 'miss'){
                this.appointmentList.splice(i, 1)
              }
            }
            this.UpComingAppointmentLoading = false
            this.TakeUpLoading = false
            return true
          }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )
    },
    // getTakeUpAppointment(appointment){
    //   this.checkedAppointment.push(appointment)
    //   for(var i = 0;i < this.appointmentList.length;i++){
    //     if(this.appointmentList[i] == appointment){
    //       this.appointmentList.splice(i, 1)
    //     }
    //   }
    //   this.TakeUpLoading = false
    // },
    getCheckedAppointment(appointment){
      for(var i = 0;i < this.checkedAppointment.length;i++){
        if(this.checkedAppointment[i].id == appointment.id){
          this.checkedAppointment.splice(i, 1)
        }
      }
      this.GetTodayAppointment('delete_load')
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
    AppointmentTimeRemain (Start_Time,End_Time){

      var currectTime = new Date()

      var appointmentStartTime = this.CoverterSimpleDate(Start_Time);
      var appointmentEndTime = this.CoverterSimpleDate(End_Time);

      var unitAppointment = (appointmentEndTime.getTime() - appointmentStartTime.getTime()) / 6

      for(var i = 0;i <= 6;i++){
        if(currectTime.getTime() < (appointmentStartTime.getTime() + (unitAppointment * i))){
          return 6 - i
        }
      }

    },
    addAppointment (){
      var Today = new Date()
      var dateApp = Today.getFullYear() + '-' + (Today.getMonth() + 1) + '-' + Today.getDate();

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
    closeOverLay(NormalClose){
      this.hover = false;
      if(!NormalClose) this.GetTodayAppointment()
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
      return date;
    },

  },
  created() {
    this.GetTodayAppointment()
  }


}
</script>

<style scoped>
/**{*/
/*  background-color: #f5f5f5;*/
/*}*/
</style>