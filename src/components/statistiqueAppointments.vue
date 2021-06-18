<template>
  <div>
    <v-card :class="`${option.backgroundColor?'white':'transparent'}`" :flat="!option.backgroundColor">
      <areachart v-if="ChartType == 'line' && !changed" :chartData="SendData" :option="chartOption"/>
      <pie-chart  v-else-if="ChartType == 'pie'&& !changed" :height="300" :chartData="SendData" :option="chartOption"  class="my-3"/>
      <bar-chart  v-else-if="ChartType == 'bar' && !changed" :chartData="SendData" :option="chartOption"/>
      <v-sheet class="d-flex justify-center" :class="`${option.backgroundColor?'white':'transparent'}`"  height="400px" v-else>
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
  name: "statistiqueAppointments",
  components: {BarChart, PieChart, Areachart},
  props: [
    'ChartType','type','timeLine','option'
  ],
  data :()=>({
    days : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    DAYS_IN_MONTH : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

    xAxisPlace :0,
    yAxisPlace:0,

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
      if(this.type == 'type'){
        this.AppointmentTypeLabel(this.timeLineCalcer(currectTime))
      }else if(this.type == 'state'){
        this.AppointmentStateLabel(this.timeLineCalcer(currectTime))
      }else {
        this.AppointmentTypeLabel(this.timeLineCalcer(currectTime))
      }

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
            if(this.type == 'type'){
              this.AppointmentTypeManager(timeLineDate)
            }else if(this.type == 'state'){

              this.AppointmentStateManager(timeLineDate)
            }else {
              this.AppointmentTypeManager(timeLineDate)
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

    AppointmentTypeManager(timeline) {
      var currentDate = timeline
      var cuttedInformation = []
      var Layout = -1
      if (this.timeLine == '7days') {
        for (var i = 0; i < this.statistiqueResult.length; i++) {
          if (currentDate != this.statistiqueResult[i].date) {
            if (this.statistiqueResult[i].type == 'consult') {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date,
                consult: 1,
                revisit: 0
              })
            } else {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date,
                consult: 0,
                revisit: 1
              })
            }
            currentDate = this.statistiqueResult[i].date
            Layout++
          } else {
            if (this.statistiqueResult[i].type == 'consult') {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                consult:cuttedInformation[Layout].consult + 1,
                revisit:cuttedInformation[Layout].revisit
              }
            } else {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                consult:cuttedInformation[Layout].consult ,
                revisit:cuttedInformation[Layout].revisit + 1
              }
            }
          }
        }
        this.statistiqueResult = cuttedInformation
        currentDate = timeline
        cuttedInformation = []
        Layout = -1
        while(Layout <= 6){
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
              consult: 0,
              revisit: 0
            })
            Layout++
            currentDate = NextCurrentDate
          }else{
            cuttedInformation.push({
              date:currentDate,
              consult: this.statistiqueResult[FoundAt].consult,
              revisit: this.statistiqueResult[FoundAt].revisit
            })
            Layout++
            currentDate = NextCurrentDate
          }
        }
      }
      else if (this.timeLine == 'month') {
        for (i = 0; i < this.statistiqueResult.length; i++) {
          if (currentDate != this.statistiqueResult[i].date) {
            if (this.statistiqueResult[i].type == 'consult') {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date,
                consult: 1,
                revisit: 0
              })
            } else {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date,
                consult: 0,
                revisit: 1
              })
            }
            currentDate = this.statistiqueResult[i].date
            Layout++
          }
          else {
            if (this.statistiqueResult[i].type == 'consult') {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                consult: cuttedInformation[Layout].consult + 1,
                revisit: cuttedInformation[Layout].revisit
              }
            } else {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                consult: cuttedInformation[Layout].consult,
                revisit: cuttedInformation[Layout].revisit + 1
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
              consult: 0,
              revisit: 0
            })
            Layout++
            currentDate = NextCurrentDate
          }else{
            cuttedInformation.push({
              date:currentDate,
              consult: this.statistiqueResult[FoundAt].consult,
              revisit: this.statistiqueResult[FoundAt].revisit
            })
            Layout++
            currentDate = NextCurrentDate
          }
        }
      }
      else if (this.timeLine == 'year') {

        for (i = 0; i < this.statistiqueResult.length; i++) {
          if (currentDate.substr(0, 7) != this.statistiqueResult[i].date.substr(0, 7)) {

            if (this.statistiqueResult[i].type == 'consult') {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date.substr(0, 7) + '-0',
                consult: 1,
                revisit: 0
              })
            } else {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date.substr(0, 7) + '-0',
                consult: 0,
                revisit: 1
              })
            }
            currentDate = this.statistiqueResult[i].date
            Layout++
          }
          else {
            if (this.statistiqueResult[i].type == 'consult') {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                consult: cuttedInformation[Layout].consult + 1,
                revisit: cuttedInformation[Layout].revisit
              }
            } else {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                consult: cuttedInformation[Layout].consult,
                revisit: cuttedInformation[Layout].revisit + 1
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
              consult: 0,
              revisit: 0
            })
            Layout++
            currentDate = NextCurrentDate
          }else{
            cuttedInformation.push({
              date:currentDate,
              consult: this.statistiqueResult[FoundAt].consult,
              revisit: this.statistiqueResult[FoundAt].revisit
            })
            Layout++
            currentDate = NextCurrentDate
          }
        }
      }
      else if (this.timeLine == 'years') {
        for (i = 0; i < this.statistiqueResult.length; i++) {
          if (currentDate.substr(0, 4) != this.statistiqueResult[i].date.substr(0, 4)) {

            if (this.statistiqueResult[i].type == 'consult') {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date.substr(0, 7) + '-0',
                consult: 1,
                revisit: 0
              })
            } else {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date.substr(0, 7) + '-0',
                consult: 0,
                revisit: 1
              })
            }
            currentDate = this.statistiqueResult[i].date
            Layout++
          }
          else {
            if (this.statistiqueResult[i].type == 'consult') {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                consult: cuttedInformation[Layout].consult + 1,
                revisit: cuttedInformation[Layout].revisit
              }
            } else {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                consult: cuttedInformation[Layout].consult,
                revisit: cuttedInformation[Layout].revisit + 1
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
              consult: 0,
              revisit: 0
            })
            Layout++
            currentDate = NextCurrentDate
          }else{
            cuttedInformation.push({
              date:currentDate,
              consult: this.statistiqueResult[FoundAt].consult,
              revisit: this.statistiqueResult[FoundAt].revisit
            })
            Layout++
            currentDate = NextCurrentDate
          }
        }
      }

      this.statistiqueResult = cuttedInformation
      this.AppointmentTypeLabel(timeline)

      var consult = 0
      var revisit = 0
      for (i = 0;i < this.statistiqueResult.length;i++){
        consult += this.statistiqueResult[i].consult
        revisit += this.statistiqueResult[i].revisit
      }
      this.$emit('callback',{
        total: consult + revisit,
        values:[
          {name:'consult',value: consult,color: '009688'},
          {name:'revisit',value: revisit,color: '2196f3'}
        ]
      })
    },
    AppointmentTypeLabel(timeline){
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
          fvalue.push(this.statistiqueResult[i].consult)
          svalue.push(this.statistiqueResult[i].revisit)
        }
        this.SendData = {
          labels: label,
          datasets: [{
            label: "consult",
            borderColor: "#009688",
            pointBackgroundColor: "#009688",
            pointBorderColor: "#009688",
            borderWidth: 5,
            backgroundColor: "#009688",
            fill: false,
            tension: 0.1,
            data: fvalue
          }, {
            label: "revisit",
            borderColor: "#2196f3",
            pointBackgroundColor: "#2196f3",
            pointBorderColor: "#2196f3",
            borderWidth: 5,
            backgroundColor: "#2196f3",
            fill: false,
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
          fvalue += this.statistiqueResult[i].consult
          svalue += this.statistiqueResult[i].revisit
        }
        this.SendData = {
          labels: ["consult", "revisit"],
          datasets: [{
            backgroundColor: ["#009688","#2196f3"],
            data: [fvalue,svalue]
          }
          ]
        }
      }
      else if(this.ChartType == 'bar'){
        fvalue = []
        svalue = []
        for (i = 0;i < this.statistiqueResult.length;i++){
          fvalue.push(this.statistiqueResult[i].consult)
          svalue.push(this.statistiqueResult[i].revisit)
        }
        this.SendData = {
          labels: label,
          datasets: [{
            label: "consult",
            borderColor: "#009688",
            borderWidth: 5,
            backgroundColor: "#009688",
            data: fvalue
          }, {
            label: "revisit",
            borderColor: "#2196f3",
            borderWidth: 5,
            backgroundColor: "#2196f3",
            data: svalue
          }
          ]
        }
      }


    },

    AppointmentStateManager(timeline) {
      var currentDate = timeline
      var cuttedInformation = []
      var Layout = -1

      if (this.timeLine == '7days') {
        for (var i = 0; i < this.statistiqueResult.length; i++) {
          if (currentDate != this.statistiqueResult[i].date) {
            if (this.statistiqueResult[i].state == 'check') {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date,
                check: 1,
                missed: 0
              })
            } else {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date,
                check: 0,
                missed: 1
              })
            }
            currentDate = this.statistiqueResult[i].date
            Layout++
          } else {
            if (this.statistiqueResult[i].state == 'check') {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                check:cuttedInformation[Layout].check + 1,
                missed:cuttedInformation[Layout].missed
              }
            } else {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                check:cuttedInformation[Layout].check ,
                missed:cuttedInformation[Layout].missed + 1
              }
            }
          }
        }
        this.statistiqueResult = cuttedInformation

        currentDate = timeline
        cuttedInformation = []
        Layout = -1
        while(Layout <= 6){
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
              check: 0,
              missed: 0
            })
            Layout++
            currentDate = NextCurrentDate
          }else{
            cuttedInformation.push({
              date:currentDate,
              check: this.statistiqueResult[FoundAt].check,
              missed: this.statistiqueResult[FoundAt].missed
            })
            Layout++
            currentDate = NextCurrentDate
          }
        }
      }
      else if (this.timeLine == 'month') {
        for (i = 0; i < this.statistiqueResult.length; i++) {
          if (currentDate != this.statistiqueResult[i].date) {
            if (this.statistiqueResult[i].state == 'check') {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date,
                check: 1,
                missed: 0
              })
            } else {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date,
                check: 0,
                missed: 1
              })
            }
            currentDate = this.statistiqueResult[i].date
            Layout++
          }
          else {
            if (this.statistiqueResult[i].state == 'check') {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                check: cuttedInformation[Layout].check + 1,
                missed: cuttedInformation[Layout].missed
              }
            } else {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                check: cuttedInformation[Layout].check,
                missed: cuttedInformation[Layout].missed + 1
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
              check: 0,
              missed: 0
            })
            Layout++
            currentDate = NextCurrentDate
          }else{
            cuttedInformation.push({
              date:currentDate,
              check: this.statistiqueResult[FoundAt].check,
              missed: this.statistiqueResult[FoundAt].missed
            })
            Layout++
            currentDate = NextCurrentDate
          }
        }
      }
      else if (this.timeLine == 'year') {

        for (i = 0; i < this.statistiqueResult.length; i++) {
          if (currentDate.substr(0, 7) != this.statistiqueResult[i].date.substr(0, 7)) {

            if (this.statistiqueResult[i].state == 'check') {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date.substr(0, 7) + '-0',
                check: 1,
                missed: 0
              })
            } else {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date.substr(0, 7) + '-0',
                check: 0,
                missed: 1
              })
            }
            currentDate = this.statistiqueResult[i].date
            Layout++
          }
          else {
            if (this.statistiqueResult[i].state == 'check') {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                check: cuttedInformation[Layout].check + 1,
                missed: cuttedInformation[Layout].missed
              }
            } else {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                check: cuttedInformation[Layout].check,
                missed: cuttedInformation[Layout].missed + 1
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
              check: 0,
              missed: 0
            })
            Layout++
            currentDate = NextCurrentDate
          }else{
            cuttedInformation.push({
              date:currentDate,
              check: this.statistiqueResult[FoundAt].check,
              missed: this.statistiqueResult[FoundAt].missed
            })
            Layout++
            currentDate = NextCurrentDate
          }
        }
      }
      else if (this.timeLine == 'years') {
        for (i = 0; i < this.statistiqueResult.length; i++) {
          if (currentDate.substr(0, 4) != this.statistiqueResult[i].date.substr(0, 4)) {

            if (this.statistiqueResult[i].state == 'check') {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date.substr(0, 7) + '-0',
                check: 1,
                missed: 0
              })
            } else {
              cuttedInformation.push({
                date: this.statistiqueResult[i].date.substr(0, 7) + '-0',
                check: 0,
                missed: 1
              })
            }
            currentDate = this.statistiqueResult[i].date
            Layout++
          }
          else {
            if (this.statistiqueResult[i].state == 'check') {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                check: cuttedInformation[Layout].check + 1,
                missed: cuttedInformation[Layout].missed
              }
            } else {
              cuttedInformation[Layout] = {
                date: cuttedInformation[Layout].date,
                check: cuttedInformation[Layout].check,
                missed: cuttedInformation[Layout].missed + 1
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
              check: 0,
              missed: 0
            })
            Layout++
            currentDate = NextCurrentDate
          }else{
            cuttedInformation.push({
              date:currentDate,
              check: this.statistiqueResult[FoundAt].check,
              missed: this.statistiqueResult[FoundAt].missed
            })
            Layout++
            currentDate = NextCurrentDate
          }
        }
      }

      this.statistiqueResult = cuttedInformation
      this.AppointmentStateLabel(timeline)

      var check = 0
      var missed = 0
      for (i = 0;i < this.statistiqueResult.length;i++){
        check += this.statistiqueResult[i].check
        missed += this.statistiqueResult[i].missed
      }



      this.$emit('callback',{
        total: check + missed,
        values:[
          {name:'check',value: check,color: '4caf50'},
          {name:'missed',value: missed,color: 'f44336'}
        ]
      })
    },
    AppointmentStateLabel(timeline){
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
          fvalue.push(this.statistiqueResult[i].check)
          svalue.push(this.statistiqueResult[i].missed)
        }
        this.SendData = {
          labels: label,
          datasets: [{
            label: "check",
            borderColor: "#4caf50",
            pointBackgroundColor: "#4caf50",
            pointBorderColor: "#4caf50",
            borderWidth: 5,
            backgroundColor: "#4caf50",
            fill: false,
            tension: 0.1,
            data: fvalue
          }, {
            label: "missed",
            borderColor: "#f44336",
            pointBackgroundColor: "#f44336",
            pointBorderColor: "#f44336",
            borderWidth: 5,
            backgroundColor: "#f44336",
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
          fvalue += this.statistiqueResult[i].check
          svalue += this.statistiqueResult[i].missed
        }
        this.SendData = {
          labels: ["check", "missed"],
          datasets: [{
            backgroundColor: ["#4caf50","#f44336"],
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
          fvalue.push(this.statistiqueResult[i].check)
          svalue.push(this.statistiqueResult[i].missed)
        }
        this.SendData = {
          labels: label,
          datasets: [{
            label: "check",
            borderColor: "#4caf50",
            borderWidth: 5,
            backgroundColor: "#4caf50",
            data: fvalue
          }, {
            label: "missed",
            borderColor: "#f44336",
            borderWidth: 5,
            backgroundColor: "#f44336",
            data: svalue
          }
          ]
        }
      }



    },

    // ChartOptionFiller(){
    //   let Xplace = []
    //   for(let i = 0;i < this.SendData.datasetsdata.length;i++){
    //     if(i == this.xAxisPlace){
    //       Xplace.push(5)
    //     }else{
    //       Xplace.push(0)
    //     }
    //   }
    //   return Xplace
    // },
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
