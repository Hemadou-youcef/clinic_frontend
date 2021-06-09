<template>
    <v-list-item class="py-0 px-2 mb-2 white--text rounded-lg lighten-4 elevation-2" >
      <v-list-item-avatar>
        <v-icon color="primary lighten-2" large>
          mdi-medical-bag
        </v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="font-weight-bold">
          Hemadou Youcef
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-content>
        <v-list-item-title>
          <v-chip color="red" class="font-weight-bold white--text">
            headache
          </v-chip>
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-content>
        <v-list-item-title>
          <v-icon color="primary">
            mdi-clock-time-one
          </v-icon>
          3:00 PM
        </v-list-item-title>
        <v-list-item-subtitle>
          2021-05-30
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <v-btn color="primary" :to="`/consultations/2`" outlined>
          <v-icon class="mr-2">
            mdi-eye-outline
          </v-icon>
          Detail
        </v-btn>
      </v-list-item-action>
    </v-list-item>
</template>

<script>
export default {
name: "ConsultationCard"
}
</script>

<style scoped>

</style>