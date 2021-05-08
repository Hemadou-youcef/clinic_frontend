<template>
  <v-card elevation="8" outlined shaped class="pt-6 pa-2 ma-3" min-width="250px" >
    <div>

    </div>
    <v-row justify="center" align="center">
      <v-avatar id="avatar" size="85px"><v-img :src="getAvatar(patientInfo.image)" aspect-ratio="1"></v-img></v-avatar>
    </v-row>
    <div class="mt-16">
      <v-row  justify="center" align="center">
        <router-link :to="`patients/${patientInfo.id}`" style="text-decoration: none;    ;">
          <div  class="text--darken-3 text-h6">{{ patientInfo.firstname }} {{patientInfo.lastname}}</div>
        </router-link>
      </v-row >
      <v-row  class="mb-3" justify="center" align="center">
        <div class="text-caption" style="font-size: 15px !important;">
          <v-icon size="20">mdi-map-marker</v-icon>
          {{patientInfo.address}}
        </div>
      </v-row>
      <v-divider class="mb-1"></v-divider>
      <v-card-text>
        <v-row class="px-2" >
          <v-col cols="6"><div class=" strong">Gender: </div></v-col>
          <v-spacer></v-spacer>
          <v-col cols="6">{{ patientInfo.gender }} </v-col>
        </v-row>
        <v-row class="px-2" >
          <v-col cols="6"><div class=" strong" >Birthday: </div></v-col>
          <v-spacer></v-spacer>
          <v-col cols="6">{{ patientInfo.birthday }} </v-col>
        </v-row>
        <v-row class="px-2" >
          <v-col cols="5"><div class=" strong">Phone: </div></v-col>
          <v-spacer></v-spacer>
          <v-col cols="7">{{ patientInfo.phone.substring(0,10)+"..." }}</v-col>
        </v-row>
<!--        <v-row class="px-2" >-->
<!--          <v-col   class="">Email: </v-col>-->

<!--          <v-col ><div  style="font-size: 12px !important;">{{patientInfo.email}}</div>  </v-col>-->
<!--        </v-row>-->
        <v-row  class="px-2" >
          <v-col cols="6"><div class="  strong">Blood Type: </div></v-col>
          <v-col cols="6">{{ patientInfo.bloodType }}</v-col>
        </v-row>

      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn @click=" showEditForm( patientInfo.id) " v-bind="attrs" v-on="on"  color="#09dca4" outlined size="30"  icon><v-icon color="#09dca4">mdi-account-edit</v-icon></v-btn>
          </template>
          <span>Edit Patient</span>
        </v-tooltip>

        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn @click="$emit('confirmDialog' , patientInfo.id) " v-bind="attrs" v-on="on"   color="red" outlined size="30"  icon><v-icon color="red">mdi-account-remove</v-icon></v-btn>
          </template>
          <span>Delete Patient</span>
        </v-tooltip>
        <v-spacer></v-spacer>



      </v-card-actions>

    </div>


  </v-card>
</template>

<script>
export default {
  name: "PatientCard",
  data:() => ({

}),
  props: ['patientInfo'],
  computed: {

  },
  methods:{
    // eslint-disable-next-line no-unused-vars
    getAvatar: (image)=>{
      return `http://localhost:8000${image}`
      // return `https://i.pravatar.cc/150?${name}`
      // return `https://avatars.dicebear.com/api/${gender}/${name}.svg`;
    },
    showEditForm(id){
      console.log('edit button clicked')
      this.$emit('showEditForm' , id)
    }
  }
}
</script>

<style scoped>
  .v-card__text .row {
    margin: -15px !important;

  }
  /*.v-card__actions {*/
  /*  align-items: center;*/
  /*  display: flex;*/
  /*  padding: 5px -10px !important;*/
  /*}*/
  #avatar{
    position: absolute;
    top: -25px;
  }


  a:hover {
    color: #09dca4 !important;
  }
  a{
    transition: all 0.5s;
  }
  .strong{
    font-weight: 600 !important;
    opacity: 0.8;

  }

</style>