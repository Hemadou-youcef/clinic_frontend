<template>
  <v-card
      class="mx-auto pa-2 pb-0 px-0"
      max-width="500"
      dark
  >
    <v-card-text class="p-2">
      <div>
        <v-form v-model="valid" ref="form">
          <v-overflow-btn
              class="my-2"
              :items="patients"
              editable
              dark
              label="patient"
              v-model="patientName"
              :rules="patientRule"
              :disabled="timed || loadingInfo"
              :loading="loadingInfo"
          >
          </v-overflow-btn>
          <v-row>
            <v-col>
              <v-switch
                  v-model="picker_model"
                  :label="(picker_model) ? 'Dated Model' : 'Longeur Model'"
              ></v-switch>
            </v-col>
            <v-col>
              <v-switch
                  v-model="revisit"
                  color="primary"
                  :class="{'custom-green': !revisit}"
                  :loading="loadingInfo"
                  :label="(!revisit) ? 'Consult' : 'revisite'"
              ></v-switch>
            </v-col>
          </v-row>



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
                :color="(revisit)?'':'#00ee00'"
                ampm-in-title
                scrollable
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
                :color="(revisit)?'':'#00ee00'"
                full-width
                scrollable
                ampm-in-title
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
            <v-btn v-if="!timed" @click="CheckAvailable(true)" :loading="Submitloading" :disabled="!valid"  :class=" { 'blue darken-1 white--text' : valid, 'disabled': !valid }">
              ADD APPOINTMENT
              <v-icon color="white" class="pl-2">mdi-plus-box</v-icon>
            </v-btn>
            <div v-else >
              <v-btn @click="CheckAvailable(false)" :loading="Editloading" :disabled="!valid" color="success" :class=" { ' white--text' : valid, 'disabled': !valid }">
                EDIT APPOINTMENT
                <v-icon color="white" class="pl-2">mdi-pencil</v-icon>
              </v-btn>
              <v-btn @click="deleteAppointment" :loading="Deleteloading" :disabled="!valid" color="red" class="ml-2" :class=" { ' white--text' : valid}">
                DELETE
                <v-icon color="white" class="pl-2">mdi-delete-outline</v-icon>
              </v-btn>
            </div>


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
  props: [
    'dateApp','timeApp','timeLApp','timed','patientId','color','appointmentId'
  ],
  data () {
    return {
      patients: [],
      patientsInfo: [],
      patientName: '',
      hello : '',

      picker_model : false,
      revisit: false,
      loadingInfo: true,
      Submitloading: false,
      Editloading: false,
      Deleteloading: false,
      valid: false,



      time: this.TimeDesign(this.timeApp),
      time_model: false,

      longeur: this.timeLApp,

      time2: this.timeApp,
      time_model2: false,

      date: new Date(this.dateApp + ' 01:00:00').toISOString().substr(0, 10),
      date_model: false,

      patientRule: [
        (v) => !!v || 'Patient is required',
      ],
      form : {
        patient_id: '',
        date: '',
        start_time: '',
        end_time: '',
        status: '',
      },
      AppointmentForm : {
        id: '',
        confirme: 'yes'
      },
    }
  },
  computed: {

  },
  methods: {
    allowedHours: m => m > 8 && m < 17,
    submitAppointment (){
          this.axios.post('/appointment/add' , this.form).then(() => {
            this.Submitloading = false;
            this.$emit('HideOverLay')
            this.$emit('ShowSnackBar','appointment Added',(this.revisit)?'primary':'green')
          }).catch(
              err => {
                this.errors = err.response.data.errors
                console.log(this.errors)
              }

          )
    },
    EditAppointment (){
        this.axios.post('/appointment/edit', Object.assign(this.form, this.AppointmentForm)).then(() => {
          this.Editloading = false;
          this.$emit('HideOverLay')
          this.$emit('ShowSnackBar', 'appointment Edited','green')
        }).catch(
            err => {
              this.errors = err.response.data.errors
              console.log(this.errors)
            }
        )
    },
    deleteAppointment (){
      this.Deleteloading = true;
      this.axios.post('/appointment/delete' , this.AppointmentForm).then(() => {
        this.Deleteloading = false;
        this.$emit('HideOverLay')
        this.$emit('ShowSnackBar','appointment Deleted','red')
      }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )

    },
    CheckAvailable (Add){
      if(Add) {
        this.Submitloading = true;
      }else{
        this.Editloading = true;
      }
      this.axios.get('/appointments/range',{
        params: { fromtime : this.form.start_time,
          totime: this.form.end_time,
          fromdate: this.form.date,
          todate: this.form.date} })
          .then((res) => {
            if(res.data.length == 0 || res.data[0].id == this.AppointmentForm.id){
              if(Add) this.submitAppointment()
              else this.EditAppointment ()
            }else {
              this.Submitloading = false;
              this.Editloading = false;
              this.$emit('ShowSnackBar','Time Already reserved !!!','red')
            }

      }).catch(

          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }

      )
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
    },
  },
  watch: {
    date(v){
      this.form.date = v;
    },
    picker_model (v){
      if(v){
        this.time = this.TimeDesign(this.time)
        this.time2 = this.TimeDesign(this.CalcAddedTime(this.time,this.longeur))
      }else {
        this.longeur = this.CalcLongeur(this.time2,this.time)
      }
    },
    time (v){
      this.form.start_time = v;
      this.time2 = this.TimeDesign(this.CalcAddedTime(this.time,this.longeur))
    },
    time2 (v){
      this.form.end_time = v;
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
          this.form.end_time = this.time2;
        }
      }
    },
    patientName (v){
      for(var i = 0; i < this.patientsInfo.length; i += 1) {
        if(this.patientsInfo[i].name === v) {
          this.form.patient_id =  this.patientsInfo[i].idreal;
          break;
        }
      }
    },
    revisit(v){
      if(v) this.form.status = 'revisit'
      else this.form.status = 'consult'
    }
  },
  created() {
      this.axios.get('/patients').then((res) => {
        for (let i = 0; i < res.data.data.length; i++) {
          const Patientid = res.data.data[i].id
          const name = res.data.data[i].firstname + ' ' + res.data.data[i].lastname

          this.patients.push(name)
          this.patientsInfo.push({
            name:name,
            idreal: Patientid,
            id: i,
          })
        }

        this.loadingInfo = false
        if(this.timed){
          if(!isNaN(this.patientId)){
            if(!(this.patientId === '')) {
              var PN;
              for(var i = 0; i < this.patientsInfo.length; i += 1) {
                if(this.patientsInfo[i].idreal === this.patientId) {
                  PN =  this.patientsInfo[i].id;
                  break;
                }
              }
              if(this.color == 'green') this.revisit = false
              else this.revisit = true

              this.patientName =  this.patients[PN];
            }
          }
        }
        this.AppointmentForm.id = this.appointmentId;
        this.form.date = this.dateApp;
        this.form.start_time = this.timeApp;
        this.form.end_time = this.TimeDesign(this.CalcAddedTime(this.time,this.timeLApp));
        this.form.patient_id = this.patientId;
        this.form.status = (this.color == 'green')? 'consult':'revisit';

      }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )


  }
}
</script>

<style>
  .custom-green .v-input--selection-controls__input div {
    color: #00ee00 !important;
  }
</style>