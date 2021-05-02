<template>
  <v-container fluid >
    <v-row class="fill-height">
      <v-col cols="2">
        <v-row>
          <v-col>
            <v-expansion-panels class="mb-6 rounded-0">
              <v-expansion-panel>
                <v-expansion-panel-header expand-icon="mdi-menu-down rounded-0">
                  WEEKDAY
                </v-expansion-panel-header>
                <v-expansion-panel-content class="rounded-0">
                  <v-row
                      no-gutters
                      style="width: available"
                  >
                    <v-col>
                      <v-checkbox
                          v-model="weekday"
                          label="Sunday"
                          v-bind:value="0"
                      ></v-checkbox>
                    </v-col>
                    <v-col>
                      <v-checkbox
                          v-model="weekday"
                          label="Tuesday"
                          v-bind:value="2"
                      ></v-checkbox>
                    </v-col>
                    <v-col>
                      <v-checkbox
                          v-model="weekday"
                          label="Wednesday"
                          v-bind:value="3"
                      ></v-checkbox>
                    </v-col>
                    <v-col>
                      <v-checkbox
                          v-model="weekday"
                          label="Thursday"
                          v-bind:value="4"
                      ></v-checkbox>
                    </v-col>
                    <v-col>
                      <v-checkbox
                          v-model="weekday"
                          label="Friday"
                          v-bind:value="5"
                      ></v-checkbox>
                    </v-col>
                    <v-col>
                      <v-checkbox
                          v-model="weekday"
                          label="Saturday"
                          v-bind:value="6"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col>

          </v-col>
        </v-row>

      </v-col>
      <v-col cols="10">
        <v-sheet height="64">
          <v-toolbar
              flat
          >
            <v-btn
                outlined
                class="mr-4"
                color="grey darken-2"
                @click="setToday"
            >
              Today
            </v-btn>
            <v-btn
                fab
                text
                small
                color="grey darken-2"
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
                color="grey darken-2"
                @click="next"
            >
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu
                bottom
                right
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    outlined
                    color="grey darken-2"
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
              @change="updateRange"
              :weekdays="weekday"
          ></v-calendar>
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

        </v-sheet>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AddAppointment from "../components/AddAppointment";
export default {
  components: {AddAppointment},
  data: () => ({
    name: "agenda",
    hover : false,
    focus: '',
    type: 'month',
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
        this.length(event.start ,event.end)

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
    length (first, second) {
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

<style scoped>

</style>