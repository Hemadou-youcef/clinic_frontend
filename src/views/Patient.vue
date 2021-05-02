<template>
  <v-container fluid class="pa-7 pb-0 pt-7 ">
    <v-card color="white">
      <v-row class="pa-3">
        <v-col cols="2">
          <v-img
              src="https://freepikpsd.com/wp-content/uploads/2019/10/person-logo-png-3.png"
              lazy-src="https://freepikpsd.com/wp-content/uploads/2019/10/person-logo-png-3.png"
              aspect-ratio="1"
          >
            <template v-slot:placeholder>
              <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
              >
                <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
        <v-col>
          <v-card-title>
            Michel Conberson
          </v-card-title>
          <v-card-text>
            Age: 26
          </v-card-text>
          <v-card-text>
            gender: Female
          </v-card-text>
          <v-card-text>
            email: mcon.2021@gmail.com
          </v-card-text>
          <v-card-text>
            N°tel: 0541354984
          </v-card-text>
        </v-col>
        <v-col>
          <BigInfoCard :darkMode="darkMode" :text="`Number Total of Appointment`" :value="4" :icon="`mdi-chart-arc`" :color="`pink`"/>
          <v-divider></v-divider>
          <BigInfoCard :darkMode="darkMode" :text="`Number Total of Consultation`" :value="1" :icon="`mdi-charity`" :color="`pink`"/>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import BigInfoCard from "../components/BigInfoCard";
export default {
  name: "Patient",
  props: [
      'darkMode'
  ],
  components: {BigInfoCard}
}
</script>

<style scoped>

</style>