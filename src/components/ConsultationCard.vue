<template>
    <v-list-item class="py-0 px-2 mb-2 white--text rounded-lg lighten-4 elevation-2" >
      <v-list-item-avatar>
        <router-link :to="`/patients/${patientid}`" style="text-decoration: none;">
          <v-img :src="$store.state.localhost+ image" width="50"></v-img>
        </router-link>
      </v-list-item-avatar>
      <v-list-item-content>
        <router-link :to="`/patients/${patientid}`" style="text-decoration: none;">
          <v-list-item-title class="font-weight-bold">
            {{ fullName }}
          </v-list-item-title>
        </router-link>
      </v-list-item-content>

      <v-list-item-content>
        <v-list-item-title>
          <v-chip color="red" style="border-radius: 5px" class="font-weight-bold white--text ml-2" v-for="(motive,index) in motives.split(',')" :key="index">
            {{ motive }}
          </v-chip>
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-content>
        <v-list-item-title class="font-weight-bold">
          <v-icon color="primary">
            mdi-calendar-range
          </v-icon>
          {{ consultation_date.slice(11,16) }}
        </v-list-item-title>
        <v-list-item-subtitle class="font-weight-bold">
          {{ consultation_date.slice(0,10) }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-content>
        <v-list-item-title class="font-weight-bold">
          <v-icon color="primary">
            mdi-calendar-range
          </v-icon>
          {{ time }}
        </v-list-item-title>
        <v-list-item-subtitle class="font-weight-bold">
          {{ date }}
        </v-list-item-subtitle>
      </v-list-item-content>



      <v-list-item-action>
        <v-btn color="primary" :to="`/consultations/${id}`" outlined>
          <v-icon class="mr-2">
            mdi-alert-circle-outline
          </v-icon>
          Detail
        </v-btn>
      </v-list-item-action>
    </v-list-item>
</template>

<script>
export default {
  name: "ConsultationCard",
  props:[
      'fullName','motives','date','time','id','patientid','image','consultation_date'
  ],
}
</script>

<style scoped>

</style>
