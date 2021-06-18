<template>
  <div>
    <v-card :class="`${option.backgroundColor?'white':'transparent'}`" :flat="!option.backgroundColor">
      <areachart v-if="ChartType == 'line' && !changed"  :chartData="SendData" :option="chartOption"/>
      <pie-chart  v-else-if="ChartType == 'pie'&& !changed" :height="300" :chartData="SendData" :option="chartOption" class="my-3"/>
      <bar-chart  v-else-if="ChartType == 'bar' && !changed" :chartData="SendData" :option="chartOption"/>
      <v-sheet class="d-flex justify-center" color="white" height="400px" v-else>
        <v-progress-linear
            v-if="ChartType != 'pie'"
            color="primary"
            indeterminate
            rounded
            height="6"
        ></v-progress-linear>
        <v-progress-circular
            v-else
            :size="200"
            :width="30"
            color="primary"
            class="align-self-center"
            indeterminate
        ></v-progress-circular>
      </v-sheet>
    </v-card>

  </div>
</template>

<script>
import Areachart from "./AriaChart";
import PieChart from "./PieChart";
import BarChart from "./BarChart";

export default {
  name: "statistiquePatients",
  components: {BarChart, PieChart, Areachart},
  props: [
      'ChartType','type','timeLine','option'
  ],
  data :()=>({
    days : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    DAYS_IN_MONTH : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

    statistiqueResult: [],
    changed:false,

    chartOption:{
      responsive: true,
      maintainAspectRatio: false,
      pointHoverBackgroundColor: 'red',
      tooltips: {
        callbacks: {
          title: function() {
            // return data['labels'][tooltipItem[0]['index']];
            return "DATA"
          },
          label: function(tooltipItem, data) {


            var StatLabel = data['datasets'][tooltipItem.datasetIndex].label
            return StatLabel + " " + data['datasets'][tooltipItem.datasetIndex]['data'][tooltipItem['index']];
          },
          labelColor: function(tooltipItem, data) {
            return {
              borderColor: 'white',
              backgroundColor: data['data']['datasets'][tooltipItem.datasetIndex].backgroundColor
            }
          }
        },
        backgroundColor: '#FFF',
        titleFontSize: 16,
        titleFontColor: '#0066ff',
        bodyFontColor: '#000',
        bodyFontSize: 20,
        xPadding: 10,
        yPadding: 10,
        mode: 'index',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 0.3,
        cornerRadius: 0,
        caretSize: 0,
        titleFontFamily: 'Roboto',
        bodyFontFamily: 'Roboto',
        stepped:true,

      },

      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            suggestedMax: 10,
            beginAtZero: true
          },

        }]
      },
    },
    SendData: {}
  }),
  watch:{
    ChartType(){
      var currectTime = new Date()

      currectTime.setHours('8')
      currectTime.setMinutes('00')
      this.PatientGenderLabel(this.timeLineCalcer(currectTime))
    },
    timeLine(){
      this.getAppointmentStatistique()
    },
    type(){
      this.getAppointmentStatistique()
    },
  },
  methods: {
    getAppointmentStatistique(){
      this.changed = true
      var currectTime = new Date()

      currectTime.setHours('8')
      currectTime.setMinutes('00')
      var TodayDate = currectTime.getFullYear() + '-' + (currectTime.getMonth() + 1) + '-' + currectTime.getDate();
      var timeLineDate = this.timeLineCalcer(currectTime)

      // var timeApp = currectTime.getHours().toString() + ':' + currectTime.getMinutes().toString();

      this.axios.get('/appointments/statistique',{
        params: { fromtime : '08:00',
          totime: '18:00',
          fromdate: timeLineDate,
          todate: TodayDate,
          type:this.type
        } })
          .then((res) => {

            this.statistiqueResult = this.orderly(res.data)
            if(this.type == 'gender'){

              this.PatientGenderManager(timeLineDate)
            }else {
              this.PatientGenderManager(timeLineDate)
            }


            this.changed = false
          }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )
    },

    timeLineCalcer(currectTime){
      if(this.timeLine == '7days'){
        currectTime.setDate(currectTime.getDate() - 6 )
        var timeLineDate = currectTime.getFullYear() + '-' + (currectTime.getMonth() + 1) + '-' + currectTime.getDate()
      }else if(this.timeLine == 'month'){
        currectTime.setMonth(currectTime.getMonth() - 1 )
        timeLineDate = currectTime.getFullYear() + '-' + (currectTime.getMonth() + 1) + '-' + currectTime.getDate()
      }else if(this.timeLine == 'year'){
        currectTime.setFullYear(currectTime.getFullYear() - 1 )
        timeLineDate = currectTime.getFullYear() + '-' + (currectTime.getMonth() + 1) + '-' + currectTime.getDate()
      }else if(this.timeLine == 'years'){
        currectTime.setFullYear(currectTime.getFullYear() - 10 )
        timeLineDate = currectTime.getFullYear() + '-' + (currectTime.getMonth() + 1) + '-' + currectTime.getDate()
      }
      return timeLineDate
    },

    PatientGenderManager(timeline) {
      var currentDate = timeline
      var cuttedInformation = []
      var Layout = -1

      if (this.timeLine == '7days') {
        for (var i = 0; i < this.statistiqueResult.length; i++) {
          if (currentDate != this.statistiqueResult[i].date) {
            if (this.statistiqueResult[i].gender == 'male') {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date,
                male: 1,
                female: 0
              })
            } else {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date,
                male: 0,
                female: 1
              })
            }
            currentDate = this.statistiqueResult[i].date
            Layout++
          } else {
            if (this.statistiqueResult[i].gender == 'male') {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                male: cuttedInformation[Layout].male + 1,
                female: cuttedInformation[Layout].female
              }
            } else {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                male: cuttedInformation[Layout].male,
                female: cuttedInformation[Layout].female + 1
              }
            }
          }
        }

        this.statistiqueResult = cuttedInformation

        currentDate = timeline
        cuttedInformation = []
        Layout = -1
        while(Layout <= 8){
          var currentDateCheck = this.CoverterSimpleDate(currentDate + ' 00:00:00')
          currentDateCheck.setDate(currentDateCheck.getDate() + 1)
          var NextCurrentDate = this.DateDesign(currentDateCheck.getFullYear() + '-' + (currentDateCheck.getMonth() + 1) + '-' + currentDateCheck.getDate())
          var NotFound = true
          var FoundAt = 0
          for(var j = 0;j < this.statistiqueResult.length;j++){
            if(currentDate == this.statistiqueResult[j].date){
              NotFound = false
              FoundAt = j
            }
          }
          if(NotFound){
            cuttedInformation.push({
              date:currentDate,
              male: 0,
              female: 0
            })
            Layout++
            currentDate = NextCurrentDate
          }else{
            cuttedInformation.push({
              date:currentDate,
              male: this.statistiqueResult[FoundAt].male,
              female: this.statistiqueResult[FoundAt].female
            })
            Layout++
            currentDate = NextCurrentDate
          }
        }
      }
      else if (this.timeLine == 'month') {
        for (i = 0; i < this.statistiqueResult.length; i++) {
          if (currentDate != this.statistiqueResult[i].date) {
            if (this.statistiqueResult[i].gender == 'male') {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date,
                male: 1,
                female: 0
              })
            } else {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date,
                male: 0,
                female: 1
              })
            }
            currentDate = this.statistiqueResult[i].date
            Layout++
          }
          else {
            if (this.statistiqueResult[i].gender == 'male') {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                male: cuttedInformation[Layout].male + 1,
                female: cuttedInformation[Layout].female
              }
            } else {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                male: cuttedInformation[Layout].male,
                female: cuttedInformation[Layout].female + 1
              }
            }
          }
        }

        this.statistiqueResult = cuttedInformation

        currentDate = timeline
        cuttedInformation = []
        Layout = -1
        while(Layout <= 30){
           currentDateCheck = this.CoverterSimpleDate(currentDate + ' 00:00:00')
          currentDateCheck.setDate(currentDateCheck.getDate() + 1)
           NextCurrentDate = this.DateDesign(currentDateCheck.getFullYear() + '-' + (currentDateCheck.getMonth() + 1) + '-' + currentDateCheck.getDate())
           NotFound = true
           FoundAt = 0
          for(j = 0;j < this.statistiqueResult.length;j++){
            if(currentDate == this.statistiqueResult[j].date){
              NotFound = false
              FoundAt = j
            }
          }
          if(NotFound){
            cuttedInformation.push({
              date:currentDate,
              male: 0,
              female: 0
            })
            Layout++
            currentDate = NextCurrentDate
          }else{
            cuttedInformation.push({
              date:currentDate,
              male: this.statistiqueResult[FoundAt].male,
              female: this.statistiqueResult[FoundAt].female
            })
            Layout++
            currentDate = NextCurrentDate
          }
        }
      }
      else if (this.timeLine == 'year') {

        for (i = 0; i < this.statistiqueResult.length; i++) {
          if (currentDate.substr(0, 7) != this.statistiqueResult[i].date.substr(0, 7)) {

            if (this.statistiqueResult[i].gender == 'male') {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date.substr(0, 7) + '-0',
                male: 1,
                female: 0
              })
            } else {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date.substr(0, 7) + '-0',
                male: 0,
                female: 1
              })
            }
            currentDate = this.statistiqueResult[i].date
            Layout++
          }
          else {
            if (this.statistiqueResult[i].gender == 'male') {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                male: cuttedInformation[Layout].male + 1,
                female: cuttedInformation[Layout].female
              }
            } else {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                male: cuttedInformation[Layout].male,
                female: cuttedInformation[Layout].female + 1
              }
            }
          }
        }
        this.statistiqueResult = cuttedInformation

        currentDate = timeline
        cuttedInformation = []
        Layout = -1
        while(Layout <= 11){
          currentDateCheck = this.CoverterSimpleDate(currentDate + ' 00:00:00')
          currentDateCheck.setMonth(currentDateCheck.getMonth() + 1)
          NextCurrentDate = this.DateDesign(currentDateCheck.getFullYear() + '-' + (currentDateCheck.getMonth() + 1) + '-' + currentDateCheck.getDate())
          NotFound = true
          FoundAt = 0
          for(j = 0;j < this.statistiqueResult.length;j++){
            if(currentDate.substr(0, 7) == this.statistiqueResult[j].date.substr(0, 7)){
              NotFound = false
              FoundAt = j
            }
          }
          if(NotFound){
            cuttedInformation.push({
              date:currentDate,
              male: 0,
              female: 0
            })
            Layout++
            currentDate = NextCurrentDate
          }else{
            cuttedInformation.push({
              date:currentDate,
              male: this.statistiqueResult[FoundAt].male,
              female: this.statistiqueResult[FoundAt].female
            })
            Layout++
            currentDate = NextCurrentDate
          }
        }
      }
      else if (this.timeLine == 'years') {
        for (i = 0; i < this.statistiqueResult.length; i++) {
          if (currentDate.substr(0, 4) != this.statistiqueResult[i].date.substr(0, 4)) {

            if (this.statistiqueResult[i].gender == 'male') {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date.substr(0, 7) + '-0',
                male: 1,
                female: 0
              })
            } else {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date.substr(0, 7) + '-0',
                male: 0,
                female: 1
              })
            }
            currentDate = this.statistiqueResult[i].date
            Layout++
          }
          else {
            if (this.statistiqueResult[i].gender == 'male') {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                male: cuttedInformation[Layout].male + 1,
                female: cuttedInformation[Layout].female
              }
            } else {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                male: cuttedInformation[Layout].male,
                female: cuttedInformation[Layout].female + 1
              }
            }
          }
        }
        this.statistiqueResult = cuttedInformation

        currentDate = timeline
        cuttedInformation = []
        Layout = -1
        while(Layout <= 9){
          currentDateCheck = this.CoverterSimpleDate(currentDate + ' 00:00:00')
          currentDateCheck.setFullYear(currentDateCheck.getFullYear() + 1)
          NextCurrentDate = this.DateDesign(currentDateCheck.getFullYear() + '-' + (currentDateCheck.getMonth() + 1) + '-' + currentDateCheck.getDate())
          NotFound = true
          FoundAt = 0
          for(j = 0;j < this.statistiqueResult.length;j++){
            if(currentDate.substr(0, 4) == this.statistiqueResult[j].date.substr(0, 4)){
              NotFound = false
              FoundAt = j
            }
          }
          if(NotFound){
            cuttedInformation.push({
              date:currentDate,
              male: 0,
              female: 0
            })
            Layout++
            currentDate = NextCurrentDate
          }else{
            cuttedInformation.push({
              date:currentDate,
              male: this.statistiqueResult[FoundAt].male,
              female: this.statistiqueResult[FoundAt].female
            })
            Layout++
            currentDate = NextCurrentDate
          }
        }
      }

        this.statistiqueResult = cuttedInformation
        this.PatientGenderLabel(timeline)

      var male = 0
      var female = 0

      for (i = 0;i < this.statistiqueResult.length;i++){
        male += this.statistiqueResult[i].male
        female += this.statistiqueResult[i].female
      }

      this.$emit('callback',{
        total: male + female,
        values:[
          {name:'male',value: male,color: '05CBE1'},
          {name:'female',value: female,color: 'e91e63'}
        ]
      })
    },
    PatientGenderLabel(timeline){
      var fvalue,svalue
      var label = []
      if (this.timeLine == '7days') {
        var DatePSD = this.CoverterSimpleDate(timeline + ' 00:00:00')
        for (var i = 0;i < 7;i++){
          label.push(this.days[DatePSD.getDay()])
          DatePSD.setDate(DatePSD.getDate() + 1)
        }
      }
      else if (this.timeLine == 'month') {
        DatePSD = this.CoverterSimpleDate(timeline + ' 00:00:00')
        for (i = 0;i < this.DAYS_IN_MONTH[DatePSD.getMonth() + 1] + 1;i++){
          label.push(DatePSD.getDate())
          DatePSD.setDate(DatePSD.getDate() + 1)
        }

      }
      else if (this.timeLine == 'year') {
        DatePSD = this.CoverterSimpleDate(timeline + ' 00:00:00')
        for (i = 0;i < 13;i++){
          label.push(this.months[DatePSD.getMonth()])
          DatePSD.setMonth(DatePSD.getMonth() + 1)
        }
      }
      else if (this.timeLine == 'years') {
        DatePSD = this.CoverterSimpleDate(timeline + ' 00:00:00')
        for (i = 0;i < 11;i++){
          label.push(DatePSD.getFullYear())
          DatePSD.setFullYear(DatePSD.getFullYear() + 1)
        }
      }



      if(this.ChartType == 'line'){
        fvalue = []
        svalue = []
        for (i = 0;i < this.statistiqueResult.length;i++){
          fvalue.push(this.statistiqueResult[i].male)
          svalue.push(this.statistiqueResult[i].female)
        }
        this.SendData = {
          labels: label,
          datasets: [{
            label: "male",
            borderColor: "#05CBE1",
            pointBackgroundColor: "#05CBE1",
            pointBorderColor: "#05CBE1",
            borderWidth: 5,
            backgroundColor: "#05CBE1",
            fill:false,
            tension: 0.1,
            data: fvalue
          }, {
            label: "female",
            borderColor: "#e91e63",
            pointBackgroundColor: "#e91e63",
            pointBorderColor: "#e91e63",
            borderWidth: 5,
            backgroundColor: "#e91e63",
            fill:false,
            tension: 0.1,
            data: svalue
          }
          ]
        }
      }
      else if(this.ChartType == 'pie'){
        fvalue = 0
        svalue = 0
        for (i = 0;i < this.statistiqueResult.length;i++){
          fvalue += this.statistiqueResult[i].male
          svalue += this.statistiqueResult[i].female
        }
        this.SendData = {
          labels: ["male", "female"],
          datasets: [{
            backgroundColor: ["#05CBE1","#e91e63"],
            data: [fvalue,svalue],
            hoverOffset: 4
          }
          ]
        }

      }
      else if(this.ChartType == 'bar'){
        fvalue = []
        svalue = []
        for (i = 0;i < this.statistiqueResult.length;i++){
          fvalue.push(this.statistiqueResult[i].male)
          svalue.push(this.statistiqueResult[i].female)
        }
        this.SendData = {
          labels: label,
          datasets: [{
            label: "male",
            borderColor: "#05CBE1",
            borderWidth: 5,
            backgroundColor: "#05CBE1",
            data: fvalue
          }, {
            label: "female",
            borderColor: "#e91e63",
            borderWidth: 5,
            backgroundColor: "#e91e63",
            data: svalue
          }
          ]
        }
      }



    },

    orderly(list){
      var NoOrdredList = list
      NoOrdredList.sort(function(a, b) {
        const first_start = a.date.split('-').join('')
        const second_start = b.date.split('-').join('')
        return first_start - second_start;
      });
      return NoOrdredList;
    },
    DateDesign (Date){
      var DateArray = Date.split('-')
      if(DateArray[1].length == 1) DateArray[1] = '0' + DateArray[1].toString()
      if(DateArray[2].length == 1) DateArray[2] = '0' + DateArray[2].toString()
      return DateArray.join('-')
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
    }

  },
  mounted() {

  },
  created() {
    this.getAppointmentStatistique()
  }
}
</script>

<style scoped>

</style>
