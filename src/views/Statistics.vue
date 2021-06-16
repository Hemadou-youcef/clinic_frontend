<template>
    <v-container class="ma-3 mt-2 pa-0 " style="width: auto !important;" fluid>
      <v-subheader>
        <router-link :to="`/dashboard`" style="text-decoration: none;    ;">
          <v-icon :color="`${(mode)?'#017e5e':'primary darken-4'}`" class="mr-2">
            mdi-home
          </v-icon>
        </router-link>
        <span>
          / Statistics
        </span>
      </v-subheader>


<!--      <v-sheet>-->
<!--          :color="(mode)?'#00b383':'primary darken-3'"-->
<!--          class="pa-4 white&#45;&#45;text font-weight-bold d-flex flex-row"-->
<!--      >-->
<!--        &lt;!&ndash;        <v-btn-toggle&ndash;&gt;-->

<!--        &lt;!&ndash;        >&ndash;&gt;-->
<!--        &lt;!&ndash;          <v-btn @click="chartType = 'line'" outlined>&ndash;&gt;-->
<!--        &lt;!&ndash;            <v-icon>mdi-chart-line</v-icon>&ndash;&gt;-->
<!--        &lt;!&ndash;          </v-btn>&ndash;&gt;-->
<!--        &lt;!&ndash;          <v-btn @click="chartType = 'pie'" outlined>&ndash;&gt;-->
<!--        &lt;!&ndash;            <v-icon>mdi-chart-arc</v-icon>&ndash;&gt;-->
<!--        &lt;!&ndash;          </v-btn>&ndash;&gt;-->
<!--        &lt;!&ndash;          <v-btn @click="chartType = 'bar'" outlined>&ndash;&gt;-->
<!--        &lt;!&ndash;            <v-icon>mdi-chart-bar</v-icon>&ndash;&gt;-->
<!--        &lt;!&ndash;          </v-btn>&ndash;&gt;-->
<!--        &lt;!&ndash;        </v-btn-toggle>&ndash;&gt;-->

<!--        <v-spacer></v-spacer>-->
<!--        <v-menu-->
<!--            bottom-->
<!--            right-->

<!--        >-->
<!--          <template v-slot:activator="{ on, attrs }">-->
<!--            <v-btn-->
<!--                outlined-->
<!--                v-bind="attrs"-->
<!--                v-on="on"-->
<!--                color="white"-->
<!--                height="47px"-->
<!--                class="mx-2"-->
<!--            >-->
<!--              <span>By {{ type }}</span>-->
<!--              <v-icon right>-->
<!--                mdi-menu-down-->
<!--              </v-icon>-->
<!--            </v-btn>-->
<!--          </template>-->
<!--          <v-list v-if="statisticsType == 'appointment'">-->
<!--            <v-list-item @click="type = 'type'">-->
<!--              <v-list-item-title>By Type</v-list-item-title>-->
<!--            </v-list-item>-->
<!--            <v-list-item @click="type = 'state'">-->
<!--              <v-list-item-title>By State</v-list-item-title>-->
<!--            </v-list-item>-->
<!--          </v-list>-->

<!--          <v-list  v-else-if="statisticsType == 'patient'">-->
<!--            <v-list-item @click="type = 'gender'">-->
<!--              <v-list-item-title>By Gender</v-list-item-title>-->
<!--            </v-list-item>-->
<!--          </v-list>-->
<!--        </v-menu>-->
<!--        <v-menu-->
<!--            bottom-->
<!--            right-->

<!--        >-->
<!--          <template v-slot:activator="{ on, attrs }">-->
<!--            <v-btn-->
<!--                outlined-->
<!--                v-bind="attrs"-->
<!--                v-on="on"-->
<!--                color="white"-->
<!--                height="47px"-->
<!--                class="mx-2"-->
<!--            >-->
<!--              <span>{{ timeLine }}</span>-->
<!--              <v-icon right>-->
<!--                mdi-menu-down-->
<!--              </v-icon>-->
<!--            </v-btn>-->
<!--          </template>-->
<!--          <v-list>-->
<!--            <v-list-item @click="timeLine = '7days'">-->
<!--              <v-list-item-title>Last 7 days</v-list-item-title>-->
<!--            </v-list-item>-->
<!--            <v-list-item @click="timeLine = 'month'">-->
<!--              <v-list-item-title>This month</v-list-item-title>-->
<!--            </v-list-item>-->
<!--            <v-list-item @click="timeLine = 'year'">-->
<!--              <v-list-item-title>this year</v-list-item-title>-->
<!--            </v-list-item>-->
<!--            <v-list-item @click="timeLine = 'years'">-->
<!--              <v-list-item-title>this years</v-list-item-title>-->
<!--            </v-list-item>-->
<!--          </v-list>-->
<!--        </v-menu>-->



<!--      </v-sheet>-->
      <v-bottom-navigation
          value="2"
          color="white"
          class="rounded-t-lg"
          :background-color="`${(mode)?'#017e5e':'primary darken-4'}`"
          grow
      >
        <v-btn @click="statisticsType = 'appointment';type = 'type';showNumericStatistique = false">
          <span>Appointment</span>

          <v-icon>mdi-calendar</v-icon>
        </v-btn>
        <v-btn  @click="statisticsType = 'patient';type =  'gender';showNumericStatistique = false" >
          <span>patient</span>

          <v-icon>mdi-account</v-icon>
        </v-btn>
      </v-bottom-navigation>
      <v-bottom-navigation
          v-if="statisticsType == 'appointment'"
          value="2"
          color="white"
          class="rounded-b-lg"
          :background-color="`${(mode)?'#017e5e':'primary darken-4'}`"
          grow
      >
        <v-btn @click="(type != 'type')?allZeroStatistique():'';type = 'type';">
          <span>By Type</span>

          <v-icon>mdi-calendar-question</v-icon>
        </v-btn>
        <v-btn  @click="(type != 'state')?allZeroStatistique():'';type =  'state'" >
          <span>By State</span>

          <v-icon>mdi-calendar-clock</v-icon>
        </v-btn>
      </v-bottom-navigation>
      <v-bottom-navigation
          v-else-if="statisticsType == 'patient'"
          value="2"
          color="white"
          class="rounded-b-lg"
          :background-color="`${(mode)?'#017e5e':'primary darken-4'}`"
          grow
      >
        <v-btn @click="(type != 'gender')?allZeroStatistique():'';type = 'gender'">
          <span>By Gender</span>

          <v-icon>mdi-gender-male-female</v-icon>
        </v-btn>
      </v-bottom-navigation>

      <v-container>
        <v-card
            class="mt-2 rounded-lg px-3"
            color="white d-flex">
          <span class="align-self-center text-h5 font-weight-bold">
            {{ TimeLineText.toUpperCase() }}
          </span>
          <v-spacer></v-spacer>
          <v-card-title class=" justify-end">
            <v-btn-toggle
                value="1"
                class="d-flex justify-end"
                background-color="transparent"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" :disabled="timeLine == 'years'" @click="(timeLine != 'years')?allZeroStatistique():'';timeLine = 'years'" class="white" outlined>
                    <v-icon>mdi-numeric-10</v-icon>
                    <v-icon style="margin-left: -13px">mdi-alpha-y</v-icon>
                  </v-btn>
                </template>
                past 10 years
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" :disabled="timeLine == 'year'" @click="(timeLine != 'year')?allZeroStatistique():'';timeLine = 'year'" class="white" outlined>
                    <v-icon>mdi-alpha-y</v-icon>
                  </v-btn>
                </template>
                yearly
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" :disabled="timeLine == 'month'" @click="(timeLine != 'month')?allZeroStatistique():'';timeLine = 'month'" class="white" outlined>
                    <v-icon>mdi-alpha-m</v-icon>
                  </v-btn>
                </template>
                monthly
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" :disabled="timeLine == '7days'" @click="(timeLine != '7days')?allZeroStatistique():'';timeLine = '7days'" class="white" outlined>
                    <v-icon>mdi-alpha-d</v-icon>
                  </v-btn>
                </template>
                weekly
              </v-tooltip>
            </v-btn-toggle>

            <v-btn-toggle
                class="ml-2"
            >
              <v-btn :disabled="chartType == 'line'" @click="chartType = 'line'" outlined>
                <v-icon large>mdi-chart-line</v-icon>
              </v-btn>
              <v-btn :disabled="chartType == 'bar'" @click="chartType = 'bar'" outlined>
                <v-icon large>mdi-chart-bar</v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-btn-toggle
                class="ml-2"
            >

              <v-btn :disabled="showChartPie" @click="showChartPie = true" outlined>
                <v-icon large>mdi-chart-arc</v-icon>
              </v-btn>
              <v-btn :disabled="!showChartPie" @click="showChartPie = false" outlined>
                <v-icon large>mdi-menu</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-card-title>
        </v-card>
        <v-card
            v-if="false"
            class="mt-2 rounded-lg pa-3"
            color="white"
            elevation="0">
          <v-row>
            <v-col></v-col>
            <v-col>
              <CardInfo class="ma-2"
                        :message="`Todays Appointment`"
                        :number="`20`"
                        :icon="`mdi-calendar`"
                        :firstColor="`1976d2`"
                        :secondColor="`33ccff`"/>
            </v-col>
            <v-col>
              <CardInfo class="ma-2"
                        :message="`Todays Appointment`"
                        :number="`13`"
                        :icon="`mdi-calendar`"
                        :firstColor="`1976d2`"
                        :secondColor="`1976d2`"/>
            </v-col>
          </v-row>
        </v-card>
        <v-card
            class="mt-2 rounded-lg pa-3"
            color="white"
        >
          <v-row>
            <v-col :cols="heightbreackpoint">
              <statistique-appointment v-if="statisticsType == 'appointment'"
                                       :ChartType="chartType"
                                       :type="type"
                                       :timeLine="timeLine"
                                       :option="{backgroundColor: true}"
                                       v-on:callback="callBackStatistique"/>

              <statistique-patients v-else-if="statisticsType == 'patient'"
                                    :ChartType="chartType"
                                    :type="type"
                                    :timeLine="timeLine"
                                    :option="{backgroundColor: true}"
                                    v-on:callback="callBackStatistique"/>
            </v-col>
            <v-col :cols="12 - heightbreackpoint">
              <div v-if="showChartPie">
                <statistique-appointment v-if="statisticsType == 'appointment'"
                                         :ChartType="`pie`"
                                         :type="type"
                                         :timeLine="timeLine"
                                         :option="{backgroundColor: false}"/>

                <statistique-patients v-else-if="statisticsType == 'patient'"
                                      :ChartType="`pie`"
                                      :type="type"
                                      :timeLine="timeLine"
                                      :option="{backgroundColor: false}"/>
              </div>
              <div v-else>
                <v-expand-transition>
                  <v-card flat elevation="0" color="transparent" v-show="showNumericStatistique">
                    <CardInfo
                              class="ma-2"
                              :message="StatisText + ' total'"
                              :number="total"
                              :firstColor="`676767`"
                              :secondColor="`676767`"
                              :mode="`simple`"/>

                    <CardInfo   v-for="info in Datavalues"
                                :key="info.name"
                                class="ma-2"
                                :message="info.name"
                                :number="info.value"
                                :firstColor="info.color"
                                :secondColor="info.color"
                                :mode="`simple`"
                                :lazyLoader="true"
                                v-on:lazyloader="lazyLoadCard"/>
                  </v-card>
                </v-expand-transition>
              </div>


            </v-col>

          </v-row>

        </v-card>

      </v-container>




    </v-container>
</template>

<script>
import StatistiqueAppointment from "../components/statistiqueAppointments";
import StatistiquePatients from "../components/statistiquePatients";
import CardInfo from "../components/CardInfo";
export default {
  name: "Statistiques",
  components: {CardInfo, StatistiqueAppointment,StatistiquePatients},
  props: [
      'mode'
  ],
  data : () => ({
    statisticsType: 'appointment',
    chartType : 'line',
    type: 'type',
    timeLine: '7days',


    total:0,
    Datavalues:[],

    showChartPie: false,
    showNumericStatistique: false,
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
    StatisText(){
      if(this.statisticsType == 'appointment'){
        return 'appointements'
      }else if(this.statisticsType == 'patient'){
        return 'patients'
      }else if(this.statisticsType == 'medicin'){
        return 'medicins'
      }
      return 'appointements'
    },
    TimeLineText(){
      if(this.timeLine == '7days'){
        return 'statistique past 7 days'
      }else if(this.timeLine == 'month'){
        return 'statistique this month'
      }else if(this.timeLine == 'year'){
        return 'statistique this year'
      }else if(this.timeLine == 'years'){
        return 'statistique past 10 years'
      }
      return 'statistique past 7 days'
    }
  },
  methods: {
    allZeroStatistique(){
      this.showNumericStatistique = false
        this.Datavalues = []
      // for(var i = 0;i < this.Datavalues.length;i++){
      //   this.Datavalues[i].value = 0
      // }
    },
    callBackStatistique(v){
        this.total = v.total
        this.Datavalues = v.values
        setTimeout(()=>{
          if(this.Datavalues.length == 0){
            this.total = v.total
            this.Datavalues = v.values
          }
        },500)
    },
    lazyLoadCard(){

      this.showNumericStatistique =  true
    }
  }
}
</script>

<style scoped>

</style>
