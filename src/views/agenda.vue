<template>
  <v-container fluid class="pa-5 pl-0 pb-0">

    <v-row class="fill-height">
      <v-col class="pt-0 pr-0">
        <v-sheet height="64"  dark>
          <v-toolbar
              flat
              :color="(darkMode)?'':'light-blue darken-4'"
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
                @click="hover = true"
                class="white--text ma-2 ml-0 rounded-0 blue darken-2 "
            >
              ADD
              <v-icon color="white" class="pl-2">mdi-plus-box</v-icon>
            </v-btn>
            <v-btn
                @click="hover = true"
                class="white--text ma-2 ml-0 rounded-0 red darken-2"
            >
              DELETE
              <v-icon color="white" class="pl-2">mdi-delete-outline</v-icon>
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
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 days</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              :event-color="getEventColor"
              :type="type"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
              @mousedown:event="editAppointment"
              @mousedown:time="addAppointment"
              :first-interval= 16
              :interval-minutes= 30
              :interval-count= 22
              @change="updateRange"
              :weekdays="weekday"
          ></v-calendar>
          <div>
            <v-fade-transition >

              <v-overlay
                  v-if="hover"
                  absolute

              >
                <v-icon  @click="hover = false;timed = false" color="white" large>
                  mdi-close-box
                </v-icon>
                <AddAppointment :dateApp="dateApp" :timeApp="timeApp" :timeLApp="timeLApp" :timed="timed" :patient="patientName"/>
              </v-overlay>
            </v-fade-transition>
          </div>


        </v-sheet>

      </v-col>
    </v-row>
    <AppFooter :darkMode="darkMode"/>
  </v-container>
</template>

<script>
import AddAppointment from "../components/AddAppointment";
import AppFooter from "../components/AppFooter";
export default {
  components: {AppFooter, AddAppointment},
  props: [
      'darkMode'
  ],
  data: () => ({
    name: "agenda",
    hover : false,
    focus: '',
    type: 'week',
    weekday: [0,1,2,3,4,5,6],
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days',
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,

    events: [],

    color: 'blue',

    dateApp: '',
    timeApp: '',
    timeLApp: 0,
    patientName: '',
    timed: false,
  }),
  mounted () {
    this.$refs.calendar.checkChange()
  },
  methods: {
    addAppointment (event){
      if(!this.timed) {
        this.dateApp = event.date;
        this.timeApp = event.time;
        this.timeLApp = 0;
        this.hover = true
      }
    },
    editAppointment ({event,timed}){
      // console.log(timed)
      // console.log(event)
      if(timed) {
        this.timed = timed
        var fdate = new Date(event.start)

        this.dateApp = fdate.getFullYear() + '-' + (fdate.getMonth() + 1) + '-' + fdate.getDate();
        this.timeApp = fdate.getHours().toString() + ':' + fdate.getMinutes().toString();
        this.patientName = event.name
        this.longeur(event.start ,event.end)

        this.hover = true
      }
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
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
      this.timeLApp = minus;
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => {
          this.selectedOpen = true
        }, 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange () {
      const events = [{
        name: 'Hemadou Youcef',
        start: '2021-04-30 09:30',
        end: '2021-04-30 10:00',
        color:this.color,
        timed:2
      },{
        name: 'bouloudnine sami',
        start: '2021-04-30 18:00',
        end: '2021-04-30 23:00',
        color:this.color,
        timed:2
      }]
      this.events = events
    },
  },
}

</script>

<style lang="scss">
</style>