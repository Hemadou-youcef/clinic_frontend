<template>
  <v-container class="ma-3 mt-2 pa-0 " style="width: auto !important;" fluid>
    <v-subheader>
      <router-link :to="`/dashboard`" style="text-decoration: none;">
        <v-icon :color="`${(mode)?'#017e5e':'primary darken-4'}`" class="mr-2">
          mdi-home
        </v-icon>
      </router-link>
      <span>
          / Consultations
        </span>
    </v-subheader>

    <v-card class="rounded-lg">
      <v-card-title>
        Consultation list
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            @click="hover = true"
            outlined
        >
          <v-icon color="primary">
            mdi-plus
          </v-icon>
          ADD
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="black"
                outlined
                v-bind="attrs"
                v-on="on"
                class="ml-3"
            >
              Sort by
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="sortby='desc'; getConsultations()">
              <v-list-item-title>DESC</v-list-item-title>
              <v-icon>mdi-arrow-down</v-icon>
            </v-list-item>
            <v-list-item @click="sortby='asc'; getConsultations()">
              <v-list-item-title>ASC</v-list-item-title>
              <v-icon>mdi-arrow-up</v-icon>
            </v-list-item>

          </v-list>
        </v-menu>


      </v-card-title>


      <v-card-text>
        <v-list>
          <v-list-item class="py-0 px-2 mb-2 rounded-lg grey lighten-4 elevation-2" style="border: 1px solid #1565c0">
            <v-list-item-avatar>
              <v-icon color="grey" large>
                mdi-account-circle
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold grey--text">
                PATIENT
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-content>
              <v-list-item-title class="font-weight-bold grey--text">
                SYNDROME
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold grey--text">
                DATE
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-content>
              <v-list-item-title class="font-weight-bold grey--text">
                APPOINTMENT DATE
              </v-list-item-title>
            </v-list-item-content>


            <v-list-item-action style="width: 110px;text-align: center">
              <v-list-item-title class="font-weight-bold grey--text">
                DETAIL
              </v-list-item-title>
            </v-list-item-action>
          </v-list-item>

          <v-progress-circular
              indeterminate
              color="primary"
              v-show="false"
          ></v-progress-circular>

          <v-row v-show="skeletonLoader">
            <v-col cols="6">
              <v-skeleton-loader
                  type="table-heading"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="4">
              <v-skeleton-loader
                  type="list-item-two-line"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="2">
              <v-skeleton-loader
                  type="actions"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
          <div v-if="!skeletonLoader && pagination.pagesCount == 0"  class="text-center text--darken-3 text-h4 py-4">No result</div>

          <consultation-card v-for="consultation in consultationsInfo"
                             :key="consultation.id"
                             :fullName="consultation.PatientFullName"
                             :motives="consultation.motive"
                             :date="consultation.date"
                             :time="consultation.time"
                             :consultation_date="consultation.consultation_date"
                             :id="consultation.id"
                             :patientid="consultation.PatientID"
                             :image="consultation.PatientImage"
          ></consultation-card>
        </v-list>
      </v-card-text>
      <div v-if="pagination.pagesCount > 0" class="text-center mb-8">
        <v-pagination

            color="secondary"
            v-model="pagination.currentPage"
            :length=" pagination.pagesCount"
        ></v-pagination>


      </div>
    </v-card>
    <v-dialog
        v-model="hover"
        transition="dialog-bottom-transition"
        max-width="800"
        :scrollable="false"
        @click:outside="closeOverLay(true)"
    >
      <AddConsultation v-on:ShowSnackBar="ShowSnackBar" v-on:HideOverLay="closeOverLay" :edit="false" :mode="mode"/>
    </v-dialog>
    <v-snackbar
        :color="snackbarColor"
        v-model="snackbar"
    >
      {{ message }}

      <template v-slot:action="{ on ,attrs }">
        <v-btn
            text
            v-bind="attrs"
            @click="snackbar = false"
            class="white--text"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import ConsultationCard from "../components/ConsultationCard";
import AddConsultation from "../components/AddConsultation";

export default {
  name: "Consultations",
  components: {ConsultationCard, AddConsultation},
  props: [
    'mode'
  ],
  data: () => ({
    consultationsInfo: [],

    pagination: {
      currentPage: 1,
      pagesCount: '0'
    },
    skeletonLoader: false,
    hover: false,
    snackbar: false,

    message: '',
    snackbarColor: '',
    sortby: 'desc'
  }),
  methods: {
    getConsultations( page =1) {
      this.skeletonLoader = true
      this.axios.get(`/consultation/all?s=${this.sortby}&page=${page}`).then((res) => {
        this.pagination.pagesCount = res.data.last_page
        this.consultationsInfo = res.data.data;
        this.skeletonLoader = false
      }).catch(
          err => {
            this.errors = err.response.data.errors
            console.log(this.errors)
          }
      )


    },
    ShowSnackBar(message, color) {
      this.snackbar = true
      this.snackbarColor = color
      this.message = message
    },
    closeOverLay(NormalClose) {
      this.hover = false;
      if (!NormalClose) this.getConsultations()
    },
  },
  created() {
    this.getConsultations()
  },
  watch:{
    'pagination.currentPage': function (newPage) {
      this.getConsultations(newPage)
    },
  }
}
</script>

<style >
  .v-skeleton-loader__button:first-child {
    display: none !important;
  }
</style>
