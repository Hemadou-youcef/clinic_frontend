<template>
  <v-container class="ma-3 mt-2 pa-0 " style="width: auto !important;" fluid>
    <v-subheader>
      <router-link :to="`/dashboard`" style="text-decoration: none;    ;">
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
            outlined
        >
          <v-icon color="primary">
            mdi-plus
          </v-icon>
          ADD
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="">
            <v-btn
                color="black"
                class="ml-2"
                outlined
            >
              <v-icon color="black">
                mdi-sort-variant
              </v-icon>
              SORT
            </v-btn>
          </template>
          <v-list>
            <v-list-item
                v-for="n in 3"
                :key="n"
            >
              <v-list-item-title>BY Patient</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

      </v-card-title>
      <v-card-title >
        <v-text-field
            label="Search"
            solo
            hide-details="false"
            outlined
            flat
        ></v-text-field>
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item class="py-0 px-2 mb-2 rounded-lg grey lighten-4 elevation-2" style="border: 1px solid #1565c0">
            <v-list-item-avatar>
              <v-icon color="grey" large>
                mdi-medical-bag
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold grey--text">
               Patient
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-content>
              <v-list-item-title class="font-weight-bold grey--text">
                  syndrome
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-content>
              <v-list-item-title class="font-weight-bold grey--text">
                Date
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-action style="width: 110px;text-align: center">
              <v-list-item-title class="font-weight-bold grey--text">
                Action
              </v-list-item-title>
            </v-list-item-action>
          </v-list-item>

          <v-progress-circular
              indeterminate
              color="primary"
              v-show="false"
          ></v-progress-circular>

          <v-row v-show="false">
            <v-col cols="6">
              <v-skeleton-loader
                  v-bind="true"
                  type="table-heading"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="4">
              <v-skeleton-loader
                  v-bind="true"
                  type="list-item-two-line"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="2">
              <v-skeleton-loader
                  v-bind="true"
                  type="actions"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
          <consultation-card v-for="n in 10" :key="n"></consultation-card>
        </v-list>
      </v-card-text>
      <v-pagination
          v-model="page"
          :length="4"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
      ></v-pagination>
    </v-card>
  </v-container>
</template>

<script>
import ConsultationCard from "../components/ConsultationCard";
export default {
name: "Consultations",
  components: {ConsultationCard},
}
</script>

<style scoped>

</style>