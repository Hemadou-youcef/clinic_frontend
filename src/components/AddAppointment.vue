<template>
  <v-card
      class="mx-auto"
      max-width="500"
  >


    <v-card-text class="p-2">
      <div>
        <v-form v-model="valid" ref="form">
          <v-select
              :items="items"
              label="CHOOSE PATIENT"
              v-model="patientName"
              dense
              solo
          ></v-select>

          <v-switch
              v-model="picker_model"
              :label="(picker_model) ? 'Dated Model' : 'Longeur Model'"
          ></v-switch>

          <v-dialog
              ref="date_dialog"
              v-model="date_model"
              :return-value.sync="date"
              persistent
              width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="date"
                  label="Date of appointment"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
                v-model="date"
                scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                  text
                  color="primary"
                  @click="date_model = false"
              >
                Cancel
              </v-btn>
              <v-btn
                  text
                  color="primary"
                  @click="$refs.date_dialog.save(date)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>


          <v-dialog
              ref="time_dialog"
              v-model="time_model"
              :return-value.sync="time"
              persistent
              width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="time"
                  :label="(picker_model) ? 'From' : 'Time'"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
                v-if="time_model"
                v-model="time"
                full-width
            >
              <v-spacer></v-spacer>
              <v-btn
                  text
                  color="primary"
                  @click="time_model = false"
              >
                Cancel
              </v-btn>
              <v-btn
                  text
                  color="primary"
                  @click="$refs.time_dialog.save(time)"
              >
                OK
              </v-btn>
            </v-time-picker>
          </v-dialog>

          <v-dialog
              v-if="picker_model"
              ref="time_dialog2"
              v-model="time_model2"
              :return-value.sync="time2"
              persistent
              width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="time2"
                  label="To"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
              ></v-text-field>
            </template>

            <v-time-picker
                v-if="time_model2"
                v-model="time2"
                full-width
            >
              <v-spacer></v-spacer>
              <v-btn
                  text
                  color="primary"
                  @click="time_model2 = false"
              >
                Cancel
              </v-btn>
              <v-btn
                  text
                  color="primary"
                  @click="$refs.time_dialog2.save(time2)"
              >
                OK
              </v-btn>
            </v-time-picker>
          </v-dialog>


          <v-text-field
              v-else
              label="Longeur Consultation"
              v-model="longeur"
              required
              class="mt-3"
              suffix="min"
          ></v-text-field>

          <v-layout justify-space-between>
            <v-spacer></v-spacer>
            <v-btn v-if="!timed" @click="submit" :disabled="!valid"  :class=" { 'blue darken-1 white--text' : valid, 'disabled': !valid }">
              ADD APPOINTMENT
              <v-icon color="white" class="pl-2">mdi-plus-box</v-icon>
            </v-btn>
            <v-btn v-else @click="submit" :disabled="!valid" color="success" :class=" { ' white--text' : valid, 'disabled': !valid }">
              EDIT APPOINTMENT
              <v-icon color="white" class="pl-2">mdi-pencil</v-icon>
            </v-btn>
            <v-snackbar
                v-model="snackbar"
            >
              {{ message }}

              <template v-slot:action="{ attrs }">
                <v-btn
                    color="pink"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                >
                  Close
                </v-btn>
              </template>
            </v-snackbar>
            <v-spacer></v-spacer>

          </v-layout>
        </v-form>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
name: "AddAppointment",
  data () {
    return {
      items: [
          'Hemadou Youcef',
          'Hemadi anis',
          'bouloudnine sami',
          'zahi oussama',
          'bensakria aboud',
          'laib zakaria',
      ],
      picker_model : false,

      patientName: this.patient,

      time: this.TimeDesign(this.timeApp),
      time_model: false,

      longeur: this.timeLApp,

      time2: this.timeApp,
      time_model2: false,

      date: new Date(this.dateApp).toISOString().substr(0, 10),
      date_model: false,

      valid: false,
      snackbar: false,
      message: 'appointment added'
    }
  },
  props: [
      'dateApp','timeApp','timeLApp','timed','patient'
  ],
  watch: {
    picker_model (v){
      if(v){
        this.time = this.TimeDesign(this.time)
        this.time2 = this.TimeDesign(this.CalcAddedTime(this.time,this.longeur))
      }else {
        this.longeur = this.CalcLongeur(this.time2,this.time)
      }
    },
    time (v){
      const long = this.CalcLongeur(this.time2,v)
      if(long < 0) {
        v = this.time2
      }else {
        this.longeur = long
      }
    },
    time2 (v){
      const long = this.CalcLongeur(v,this.time)

      if(long < 0) {
        v = this.time
      }else {
        this.longeur = long
      }
    },
    longeur (v){
      if(!isNaN(v)){
        if(!(v === '')) {
          this.time2 = this.TimeDesign(this.CalcAddedTime(this.time,v))
        }
      }
    },
  },
  methods: {
    submit (){
      this.snackbar= true;
    },
    CalcLongeur (first,second) {
      var changed_time = first.split(':')
      first = (parseInt(changed_time[0]) * 60) +  parseInt(changed_time[1]);

      changed_time = second.split(':')
      second = (parseInt(changed_time[0]) * 60) +  parseInt(changed_time[1]);

      var minus = first - second

      return minus;
    },
    CalcAddedTime(time,minute){
      const changed_time = time.split(':')

      time = (parseInt(changed_time[0]) * 60) +  parseInt(changed_time[1]) + parseInt(minute);

      const stime = (time / 60).toString().split('.')
      var nhours = stime[0]

      var nminutes;
      if(stime.length == 1){
        nminutes = 0
      }else {
        nminutes = Math.round(parseFloat('0.' + stime[1]) * 60)
      }
      return nhours + ':' + nminutes
    },
    TimeDesign (time){
      var TimeArray = time.split(':')
      if(TimeArray[0].length == 1) TimeArray[0] = '0' + TimeArray[0].toString()
      if(TimeArray[1].length == 1) TimeArray[1] = '0' + TimeArray[1].toString()
      return TimeArray.join(':')
    }
  },

}
</script>

<style scoped>

</style>