<template>
  <v-container fluid class="ma-0 pa-5 pb-0 px-0">
    <v-row class="pa-3">
      <v-col cols="10" class="pr-0">
        <v-text-field
          v-model="search"
          clearable
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search"
          class="rounded-0 black--text"
          :dark="darkMode"
        ></v-text-field>
      </v-col>
      <v-col class="pa-0 pt-3">
        <v-menu
            bottom
            right
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                outlined
                v-bind="attrs"
                v-on="on"
                class="pa-2 mt-0 rounded-0"
                height="48px"
                :color="(darkMode)?'white':'grey darken-2'"
            >
              <span>{{ searchType }}</span>
              <v-icon right>
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list class="rounded-0" :dark="!darkMode">
            <v-list-item @click="searchType = 'name'">
              <v-list-item-title>Name</v-list-item-title>
            </v-list-item>
            <v-list-item @click="searchType = 'email'">
              <v-list-item-title>Email</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>


    <v-data-table
        :headers="headers"
        :items="filteredKeys"
        :items-per-page="5"
        class="elevation-1 text-lg-h2 rounded-0"
    >
      <template v-slot:item.name="{ item }">
        <v-btn to="/patients/1">
          {{ item.name }}
        </v-btn>
      </template>

    </v-data-table>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <AppFooter :darkMode="darkMode"/>
  </v-container>
</template>

<script>
import AppFooter from "../components/AppFooter";
export default {
name: "Patient",
  components: {AppFooter},
  props: [
      'darkMode'
  ],
  data () {
    return {
      search: '',
      searchType: 'name',
      headers: [
        {
          text: 'Full Name',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        { text: 'Age', value: 'age' },
        { text: 'Email', value: 'email' },
        { text: 'N°Tel', value: 'NumTel' },
      ],
      Info: [
        {
          name: 'Hemadou Youcef',
          age: 20,
          email: 'youcef.h2014@gmail.com',
          NumTel: '0555912812',
        },
        {
          name: 'Bouloudnine Same',
          age: 20,
          email: 'blg18@gmail.com',
          NumTel: '0548413213',
        },
        {
          name: 'zahi oussama',
          age: 22,
          email: 'oussama.zahi@univ.constantine2.dz',
          NumTel: '0654165161',
        },
      ],
    }
  },
  watch: {
    search (v){
      console.log('search value ' + v)
      console.log('current value ' + v)
    }
  },
  computed: {
    filteredKeys () {
      var search_value = this.search;
      var search_type = this.searchType;
      return this.Info.filter(function (key){
        if(isNaN(search_value)) {
          if (!(search_value === '')) {
            var re = new RegExp(search_value,'i');
            if(search_type == 'name'){
              return key.name.match(re);
            }else if(search_type == 'email'){
              return key.email.match(re);
            }
          }
        }
          return true
      });

    },
  },

}
</script>

<style scoped>

</style>