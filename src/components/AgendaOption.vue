<template>
  <v-card>
    <v-card-title class="text-h5">
      AGENDA OPTIONS
    </v-card-title>
    <v-divider class="mx-4"></v-divider>
    <v-card-title class="mt-3 pa-0 pl-3">From</v-card-title>
    <v-row class="ma-0">
      <v-col>
        <v-select
            :items="Hours"
            v-model="SelectedStartHour"
            height="40px"
            clear-icon
            dense
            outlined
            hide-details
        ></v-select>
      </v-col>
      <v-col cols="1">
        <span class="text-h6 font-weight-bold">:</span>
      </v-col>
      <v-col>
        <v-select
            :items="Minute"
            v-model="SelectedStartMinute"
            height="40px"
            dense
            outlined
            hide-details
        ></v-select>
      </v-col>
      <v-col>
        <v-btn-toggle v-model="SelectedStartType" :rules="requireField">
          <v-btn height="40px">
            AM
          </v-btn>

          <v-btn height="40px">
            PM
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-card-title class="mt-3 pa-0 pl-3">To</v-card-title>
    <v-row class="ma-0">
      <v-col>
        <v-select
            :items="Hours"
            v-model="SelectedEndHour"
            clear-icon
            height="40px"
            dense
            outlined
            hide-details
        ></v-select>
      </v-col>
      <v-col cols="1">
        <span class="text-h6 font-weight-bold">:</span>
      </v-col>
      <v-col>
        <v-select
            :items="Minute"
            v-model="SelectedEndMinute"
            height="40px"
            dense
            outlined
            hide-details
        ></v-select>
      </v-col>
      <v-col>
        <v-btn-toggle v-model="SelectedEndType" :rules="requireField">
          <v-btn height="40px">
            AM
          </v-btn>

          <v-btn height="40px">
            PM
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <div class="d-flex  justify-space-between align-center pa-3">
      <span class="font-weight-bold ">
        Default view
      </span>
      <v-spacer></v-spacer>
      <v-select
          :items="AgendaType"
          v-model="SelectedAgendaType"
          height="40px"
          dense
          outlined
          hide-details
      ></v-select>
    </div>
    <v-divider class="mx-4"></v-divider>
    <div class="pa-3 d-flex justify-center">
      <v-btn color="primary" class="white" @click="save">
        SAVE
      </v-btn>
      <v-btn color="grey" class="ml-2 white--text">
        DEFAULT
      </v-btn>
    </div>


  </v-card>
</template>

<script>
export default {
  name: "AgendaOption",
  data: () => ({
    SelectedStartHour: '08',
    SelectedStartMinute: '00',
    SelectedStartType: 0,
    SelectedEndHour: '06',
    SelectedEndMinute: '00',
    SelectedEndType: 1,
    SelectedAgendaType: 'WEEK',
    Hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'],
    Minute: ['00','15','30','45'],
    AgendaType: [
      {
        text: 'MONTH',
        value: 'month',
      },
      {
        text: 'WEEK',
        value: 'custom-daily',
      },
      {
        text: 'DAY',
        value: 'day',
      }
    ],

    requireField: [
      (v) => !!v || 'field is required',
    ],
  }),
  computed:{
    getworkingStartTime(){
      return this.$store.state.workingStartTime
    },
    getworkingEndTime(){
      return this.$store.state.workingEndTime
    },
    getagendaView(){
      return this.$store.state.agendaView
    },

  },
  methods: {
    save(){
      var firstInterval = (parseInt(this.SelectedStartHour) * 4) + parseInt(this.SelectedStartMinute) / 15 + this.SelectedStartType * 48
      var intervalCount = (parseInt(this.SelectedEndHour) * 4) + parseInt(this.SelectedEndMinute) / 15 + this.SelectedEndType * 48 - firstInterval

      this.$store.commit('setworkingStartTime' , firstInterval)
      this.$store.commit('setworkingEndTime' , intervalCount)
      this.$store.commit('setagendaView' , this.SelectedAgendaType)

      localStorage.setItem('workingStartTime' , firstInterval )
      localStorage.setItem('workingEndTime' , intervalCount )
      localStorage.setItem('agendaView' , this.SelectedAgendaType )
      this.$emit('HideOverLay')
    },
    converterFromIntervaltoTime(interval){
      let info = {
        hour: '',
        minute: '',
        type: 1,
      }
      if(interval % 4 == 0){
        info.minute = '00'
        if(interval / 4 >= 12){
          info.type = 1
          info.hour = this.AddZero(interval / 4 - 12)
        }else{
          info.type = 0
          info.hour = this.AddZero(interval / 4)
        }
      }else{
        info.minute = this.AddZero((interval % 4) * 15).toString()
        if(interval / 4 >= 12){
          info.type = 1
          info.hour = this.AddZero(parseInt(interval / 4 )- 12)
        }else{
          info.type = 0
          info.hour = this.AddZero(parseInt(interval / 4 ))
        }
      }
      return info
    },
    AddZero(number){
      if(number >= 10 || number <= 0){
        return number
      }else{
        return '0' + number
      }
    }
  },
  created() {
    var startInfo = this.converterFromIntervaltoTime(parseInt(localStorage.getItem('workingStartTime')))
    var endInfo = this.converterFromIntervaltoTime(parseInt(localStorage.getItem('workingEndTime')) + parseInt(localStorage.getItem('workingStartTime')))

    this.SelectedStartHour = startInfo.hour
    this.SelectedStartMinute= startInfo.minute
    this.SelectedStartType= startInfo.type

    this.SelectedEndHour= endInfo.hour
    this.SelectedEndMinute= endInfo.minute
    this.SelectedEndType= endInfo.type
    this.SelectedAgendaType = localStorage.getItem('agendaView')
  }
}
</script>

<style scoped>

</style>
