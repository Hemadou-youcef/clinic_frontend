<template>
  <v-container fluid class="pa-5 pl-0 pb-0">

    <v-row class="fill-height">
      <v-col class="pt-0 pr-0">
        <v-sheet height="64"  dark>
          <v-toolbar
              flat
              color="secondary"
          >
            <v-btn
                outlined
                class="mr-4"
                @click="setToday"
            >
              Today
            </v-btn>
            <v-btn
                fab
                text
                small
                @click="prev"
            >
              <v-icon small>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn
                fab
                text
                small
                @click="next"
            >
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar" >
              {{ $refs.calendar.title }}
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn
                @click="addAppointment('new')"
                class="white--text ma-2 ml-0 blue darken-2 "
            >
              <v-icon color="white">mdi-plus-box</v-icon>
            </v-btn>

            <v-btn
                :disabled="!this.AlreadyselectedEvent"
                @click="editAppointment"
                class="white--text ma-2 ml-0 teal darken-2 darken-2"
            >
              <v-icon color="white">mdi-pencil</v-icon>
            </v-btn>

            <v-btn
                color="white"
                class="white--text ma-2 ml-0 grey "
            >
              <v-icon>
                mdi-tune
              </v-icon>
            </v-btn>

            <v-menu
                bottom
                right
                dark
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    outlined
                    v-bind="attrs"
                    v-on="on"

                >
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list >
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
              ref="calendar"
              v-model="focus"
              color="secondary"
              :events="events"
              :event-color="getEventColor"
              :type="type"
              @click:more="viewDay"
              @click:date="viewDay"
              @mousedown:time="addAppointment"
              @mousedown:event="selectAppointment"
              :first-interval= 32
              :interval-minutes= 15
              :interval-count= 36
              :interval-height="30"
          >
            <template v-slot:day-header="{date,weekday}">
              <div
                  class="ma-2 pa-2"
              >
                <div v-if="type != 'day'" class="d-flex flex-column justify-center">
                  <span style="text-align: center" class="mb-2">{{ daysInWeek[weekday]}}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                      class="mx-auto text-caption"
                      :class="{'secondary white--text ': getFullDate() == date}"
                      @click="viewDay(date)"
                  >
                    {{date}}
                  </v-btn>
                </div>



                <div v-else>
                  <v-row>
                    <v-col>
                          <span class="text-caption font-weight-bold">
                            {{ date }}
                            {{ (getFullDate() == date)? '(Today)':''}}
                          </span>
                    </v-col>
                    <v-col cols="2">

                    </v-col>
                  </v-row>
                </div>
              </div>
            </template>
            <template v-slot:event="{event}">

              {{ CheckColorAppointment(event)}}
              <div @contextmenu="show" style="height: 100%;">
                <h2 v-if="type == 'day'" class="white--text font-weight-bold align-center pa-1 pt-0" >
                  {{ event.name}}
                  From: {{ event.start.split(' ')[1]}}
                  To: {{ event.end.split(' ')[1]}}
                </h2>
                <h3  v-if="type == 'week'" class="white--text font-weight-bold align-center pa-1 pt-1" style="overflow: visible">
                  {{event.start.split(' ')[1] + ' - ' + event.name}}
                </h3>
                <h3 v-if="type == 'month'" class="white--text font-weight-bold align-center pl-2">
                  {{event.name.toString()}}
                </h3>
              </div>

            </template>

            <template v-slot:day-body="{ date }">
              <div
                  v-if="getFullDate() == date"
                  class="v-current-time-accual"
                  :style="{ top: nowY }"
              >
                <p >
                  <v-icon color="black">
                    mdi-timeline-clock-outline
                  </v-icon>
                  {{ getFullTime() }}
                </p>
              </div>

            </template>


          </v-calendar>
          <div>
            <v-dialog
                v-model="hover"
                transition="dialog-bottom-transition"
                max-width="500"
                :scrollable="false"
                @click:outside="closeOverLay(true)"
            >
              <AddAppointment v-if="hover" v-on:ShowSnackBar="ShowSnackBar" v-on:HideOverLay="closeOverLay" :dateApp="dateApp" :timeApp="timeApp" :timeLApp="timeLApp" :timed="timed" :patientId="PatientId" :appointmentId="AppointmentId" :color="color"/>
            </v-dialog>

          </div>
          <v-menu
              v-model="showMenu"
              :position-x="x"
              :position-y="y"
              absolute
              offset-y
              :close-on-content-click="false"
              class="rounded-0 pa-0"
              :nudge-width="200"
          >
            <v-card>
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <img
                        :src="$store.state.localhost+ MenuPatientImage"
                    >
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{ MenuPatient }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ MenuTimeLine }}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn
                        color="white"

                        class="teal darken-2"
                        @click="editAppointment"
                    >
                      <v-icon color="white">mdi-pencil</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-action>
                    <v-btn
                        class="red"
                        :loading="Deleteloading"
                        @click="deleteAppointment"
                    >
                      <v-icon color="white">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-title>
                  <v-chip
                      v-if="MenuSelectedEvent.realcolor == 'teal'"
                      class="ma-2 white--text font-weight-bold"
                      label
                      color="teal"
                  >
                    consult
                  </v-chip>
                  <v-chip
                      v-else
                      class="ma-2 white--text font-weight-bold"
                      label
                      color="primary"
                  >
                    revisit
                  </v-chip>
                  <v-chip
                      v-if="MenuSelectedEvent.dead == true"
                      class="ma-2 white--text"
                      label
                      color="grey"
                  >
                    Dead Appointment
                    <v-icon color="white" class="pl-2">
                      mdi-robot-dead
                    </v-icon>
                  </v-chip>
                </v-list-item-title>
              </v-list-item>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    text
                    @click="showMenu = false"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
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
        </v-sheet>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AddAppointment from "../components/AddAppointment";
export default {
  name: "agenda",
  components: {AddAppointment},
  props: [
    'darkMode'
  ],
  data: () => ({
    focus: '',
    type: 'week',
    daysInWeek : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    AppointmentForm : {
      id: '',
      confirme: 'yes'
    },
    events: [],
    selectedEvent: {},
    color: '',
    snackbarColor: '',
    dateApp: '',
    timeApp: '',
    timeLApp: 0,
    AppointmentId: '',
    PatientId: '',
    message: '',
    MenuSelectedEvent: {},
    MenuPatient: '',
    MenuPatientImage: '',
    MenuTimeLine: '',
    x: 0,
    y: 0,
    hover : false,
    showMenu : false,
    ready: false,
    AlreadyselectedEvent: false,
    TwoClick : false,
    timed: false,
    Deleteloading: false,
    snackbar: false,
  }),
  computed: {
    cal () {
      return this.ready ? this.$refs.calendar : null
    },
    nowY () {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
    },
  },
  mounted () {
    this.$refs.calendar.checkChange()
    this.ready = true
    this.scrollToTime()
    this.updateTime()
  },
  created() {
    this.getAppointment();
  },
  methods: {
    getAppointment (){
      this.axios.get('/appointments/all').then((res) => {
        this.events = [];
        for (let i = 0; i < res.data.data.length; i++) {
          const name =  `${res.data.data[i].patient_firstname} ${res.data.data[i].patient_lastname}`
          const image = res.data.data[i].image
          const id = res.data.data[i].id
          const idPatient = res.data.data[i].patient_id
          const start = res.data.data[i].date + ' ' + res.data.data[i].start.substr(0,5)
          const end = res.data.data[i].date + ' ' + res.data.data[i].end.substr(0,5)
          const color = (res.data.data[i].type == 'consult')? 'teal': 'primary'

          this.events.push({
            name: name,
            id: id,
            idpatient:idPatient,
            start: start,
            end: end,
            color:color,
            dead: false,
            realcolor: color,
            image : image
          })
        }
      }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )
    },
    deleteAppointment (){
      this.Deleteloading = true;
      this.AppointmentForm.id = this.selectedEvent.id
      this.axios.post('/appointment/delete' , this.AppointmentForm).then(() => {
        var ThStat = this;
        setTimeout(function (){
          ThStat.Deleteloading = false
          ThStat.showMenu = false
          ThStat.getAppointment()
          ThStat.ShowSnackBar('appointment Deleted','red')
        },500);
      }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )
    },
    selectAppointment({event,timed}){
      if(timed) {
        this.timed = true
        this.TwoClick = true
        if (typeof this.selectedEvent === 'object' && this.selectedEvent !== null) {
          if (event != this.selectedEvent) {
            this.selectedEvent.color = this.selectedEvent.realcolor;
            this.selectedEvent = event;
            this.MenuSelectedEvent = event
            this.MenuPatient = event.name
            this.MenuPatientImage = event.image
            this.MenuTimeLine = `From ${event.start.split(' ')[1]} To: ${event.end.split(' ')[1]}`
            this.selectedEvent.color = 'red'
            this.AlreadyselectedEvent = true
          }else {
            if(!this.showMenu){
              this.selectedEvent.color = this.selectedEvent.realcolor;
              this.selectedEvent = {}
              this.timed = false
              this.AlreadyselectedEvent = false
            }
          }
        } else {
          this.selectedEvent = event
          this.selectedEvent.color = 'red'
          this.AlreadyselectedEvent = true
        }
      }
    },
    addAppointment (event){
      if(!this.TwoClick) {
        if(!this.showMenu){
          if (typeof event !== 'object') {
            this.dateApp = this.getFullDate()
            this.timeApp = '08:00'
            this.timeLApp = 15
            this.color = 'teal darken-1'
          } else {
            this.dateApp = event.date;
            var hour = event.time.split(':')[0]
            var minute = parseInt(event.time.split(':')[1])
            if (minute < 15) {
              this.timeApp = hour + ':00';
            } else if (minute < 30) {
              this.timeApp = hour + ':15';
            } else if (minute < 45) {
              this.timeApp = hour + ':30';
            } else {
              this.timeApp = hour + ':45';
            }
            this.timeLApp = 15;
            this.color = 'teal';
          }
          this.timed = false
          this.hover = true
        }
      }else {
        this.TwoClick = false;
      }
    },
    editAppointment (){
      const event = this.selectedEvent
      if(this.timed) {
        var fdate = new Date(event.start)
        this.dateApp = fdate.getFullYear() + '-' + (fdate.getMonth() + 1) + '-' + fdate.getDate();
        this.timeApp = fdate.getHours().toString() + ':' + fdate.getMinutes().toString();
        this.AppointmentId = event.id
        this.PatientId = event.idpatient
        this.color = event.realcolor
        this.timeLApp = this.longeur(event.start ,event.end)
        this.showMenu = false
        this.hover = true
      }
    },
    getCurrentTime () {
      return this.cal ? this.cal.times.now.hour * 60 + this.cal.times.now.minute : 0
    },
    scrollToTime () {
      const time = this.getCurrentTime()
      const first = Math.max(0, time - (time % 30) - 30)
      this.cal.scrollToTime(first)
    },
    updateTime () {
      setInterval(() => this.cal.updateTimes(), 60 * 1000)
    },
    getFullDate(){
      var fdate = new Date()
      return this.TimeDesignDate(fdate.getFullYear() + '-' + (fdate.getMonth() + 1) + '-' + fdate.getDate());
    },
    getFullTime(){
      var fdate = new Date()
      return this.TimeDesignTime(fdate.getHours().toString() + ':' + fdate.getMinutes().toString());
    },
    TimeDesignDate (time){
      var TimeArray = time.split('-')
      if(TimeArray[1].length == 1) TimeArray[1] = '0' + TimeArray[1].toString()
      if(TimeArray[2].length == 1) TimeArray[2] = '0' + TimeArray[2].toString()
      return TimeArray.join('-')
    },
    TimeDesignTime (time){
      var TimeArray = time.split(':')
      if(TimeArray[0].length == 1) TimeArray[0] = '0' + TimeArray[0].toString()
      if(TimeArray[1].length == 1) TimeArray[1] = '0' + TimeArray[1].toString()
      return TimeArray.join(':')
    },
    viewDay (date) {
      if(typeof date === 'object' && date !== null){
        this.focus = date.date
        this.type = 'day'
      }else {
        this.focus = date
        this.type = 'day'
      }
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    longeur (first,second) {
      var firstD = new Date(first)
      var secondD = new Date(second)
      var minus = (secondD.getTime() - firstD.getTime()) / 60000
      return  minus;
    },
    closeOverLay(NormalClose){
      this.hover = false;
      if(!NormalClose) this.getAppointment()
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
    CheckColorAppointment(event){
      if(event.color == event.realcolor){
        if(this.CheckingDeadAppointment(event)){
          event.color = 'grey'
          event.dead = true
        }
      }
    },
    CheckingDeadAppointment(event){
      if((this.CoverterSimpleDate(event.end).getTime() - new Date().getTime()) <= 0){
        return true
      }
      return false
    },
    ShowSnackBar(message,color){
      this.snackbar = true
      this.snackbarColor = color
      this.message = message
    },
    show (e) {
      e.preventDefault()
      this.showMenu = false
      if(this.AlreadyselectedEvent){
        this.MenuSelectedEvent = this.selectedEvent
        this.MenuPatient = this.selectedEvent.name
        this.MenuTimeLine = `From ${this.selectedEvent.start.split(' ')[1]} To: ${this.selectedEvent.end.split(' ')[1]}`
      }else {
        this.AlreadyselectedEvent = true
        this.timed = true
        this.selectedEvent = this.MenuSelectedEvent
        this.selectedEvent.color = 'red'
      }
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenu = true
      })
    },
  },
}
</script>

<style lang="scss">
.v-current-time-accual {
  //height: 2px;
  //background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;
}
.v-current-time-accual p {
  margin-top: -11px;
  font-weight: bold;
}
.v-calendar-daily_head-weekday,
.v-calendar-daily_head-day-label {
  display: none;
}
.v-event-timed-container {
  margin-right: 0px !important;
}
.v-event-timed:active {
  outline: 3px solid #afc8d7 !important;
}
.v-calendar-daily__day-interval:hover {
  background-color: #afc8d7;
  cursor: pointer;
}
.v-dialog {
  box-shadow: none !important;
}
</style>