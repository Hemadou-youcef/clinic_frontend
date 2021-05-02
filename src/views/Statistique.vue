<template>
  <v-container fluid class="pl-0 pb-0">
    <v-row>
      <v-col class="pr-0" >
        <BigInfoCard :darkMode="darkMode" :text="`Appointment This Month`" :value="102" :icon="`mdi-calendar-multiple-check`" :color="`blue`"/>
      </v-col>
      <v-col class="pr-0  pl-0">
        <BigInfoCard :darkMode="darkMode" :text="`Consultation This Month`" :value="1536" :icon="`mdi-heart-pulse`" :color="`red`"/>
      </v-col>

    </v-row>
    <v-row>
      <v-col cols="1">
        <v-menu

        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                class="black--text"
                color="white"
                v-bind="attrs"
                v-on="on"
            >
              <span>{{type}}</span>
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
            <v-list-item @click="type = 'year'">
              <v-list-item-title>Year</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col>
        <v-divider class="mt-4"></v-divider>
      </v-col>
    </v-row>



    <v-row>
      <v-col>
        <v-card-text>
          <v-sheet color="blue" class="pa-5">
            <span class="white--text text-lg-h3">37 Patient</span>
            <v-sparkline
                :value="value"
                show-labels
                color="rgba(255, 255, 255, .7)"
                height="100"
                padding="0"
                stroke-linecap="round"
                line-width="2"
                smooth
            >
              <template v-slot:label="item">
                {{ item.value }} Patient
              </template>
            </v-sparkline>
          </v-sheet>
        </v-card-text>
      </v-col>
      <v-col>
        <v-card-text>
          <v-sheet color="#66ff99" class="pa-5">
            <v-row>
              <v-col>
                <span class="white--text text-lg-h3 font-weight-bold">50 Male</span>
              </v-col>
            </v-row>
          </v-sheet>
          <v-sheet color="#3399ff" class="pa-5">
            <v-row>
              <v-col>
                <span class="white--text text-lg-h3 font-weight-bold">20 Female</span>
              </v-col>
            </v-row>
          </v-sheet>
        </v-card-text>
      </v-col>
      <v-col>
        <v-card-text>
          <v-sheet color="blue" class="pa-5">
            <span class="white--text text-lg-h3">37 Patient</span>
            <v-sheet
                class="d-flex"
                color="grey lighten-3"
                width="20"
                height="50"
            >
            </v-sheet>
          </v-sheet>
        </v-card-text>
      </v-col>

    </v-row>
    <br/>
    <AppFooter :darkMode="darkMode"/>
  </v-container>
</template>

<script>

import BigInfoCard from "../components/BigInfoCard";
import AppFooter from "../components/AppFooter";
export default {
  name: 'Statistique',
  props: [
      'darkMode'
  ],
  data: () => ({
    type: 'Day',
    value: [
      10,
      8,
      7,
      2,
      5,
      5,
      8,
    ],
  }),
  components: {
    AppFooter,
    BigInfoCard

  },
}
</script>

<style>

</style>
