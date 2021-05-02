<template>
  <v-container fluid class="pl-0 pb-0">
    <v-row>
      <v-col class="pr-0">
        <BigInfoCard  :darkMode="darkMode" :text="`Appointment Today`" :value="8" :icon="`mdi-calendar-multiple-check`" :color="`blue`"/>
      </v-col>
      <v-col class="pr-0 pl-0">
        <BigInfoCard  :darkMode="darkMode" :text="`Consultation Today`" :value="4" :icon="`mdi-heart-pulse`" :color="`red`"/>
      </v-col>

    </v-row>
    <v-row>
      <v-col>
        <v-card-text>
          <v-sheet color="#003366">
            <v-card-title class="white--text">APPOINTMENT TODAY</v-card-title>
            <v-btn icon style="margin-top: -30px;margin-right: 10px;width: 60px;height: 60px;float: right" class="teal darken-1">
              <v-icon color="white" large>
                mdi-plus
              </v-icon>
            </v-btn>
          </v-sheet>

          <v-sheet color="white">
            <v-card-text class="text-lg-h5 " >Hemadou Youcef | AT: 8:00 TO 8:30</v-card-text>
            <v-divider></v-divider>
            <v-card-text class="text-lg-h5 " >Hemadou Youcef | AT: 8:00 TO 8:30</v-card-text>
            <v-divider></v-divider>
            <v-card-text class="text-lg-h5 " >Hemadou Youcef | AT: 8:00 TO 8:30</v-card-text>
            <v-divider></v-divider>
            <v-card-text class="text-lg-h5 " >Hemadou Youcef | AT: 8:00 TO 8:30</v-card-text>
            <v-divider></v-divider>
            <v-card-text class="text-lg-h5 " >Hemadou Youcef | AT: 8:00 TO 8:30</v-card-text>
            <v-divider></v-divider>
          </v-sheet>
        </v-card-text>
      </v-col>
      <v-col>
        <v-card-text>
          <v-sheet color="#e6e600">
            <v-card-title class="white--text">CONSULTATION TODAY</v-card-title>
          </v-sheet>
          <v-sheet color="white">
            <v-card-text class="text-lg-h5 " >CONSULTATION OF: Hemadou Youcef </v-card-text>
            <v-divider></v-divider>
          </v-sheet>
        </v-card-text>
      </v-col>

    </v-row>
    <AppFooter :darkMode="darkMode"/>
  </v-container>
</template>

<script>

  import BigInfoCard from "../components/BigInfoCard";
  import AppFooter from "../components/AppFooter";
  export default {
    name: 'Home',
    data: () => ({
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
    props: [
        'darkMode'
    ]
  }
</script>
