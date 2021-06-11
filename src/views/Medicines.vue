<template>
  <div>
    <v-container fluid>
      <v-subheader>
        <router-link :to="`/dashboard`" style="text-decoration: none;    ;">
          <v-icon :color="`${(mode)?'#017e5e':'primary darken-4'}`" class="mr-2">
            mdi-home
          </v-icon>
        </router-link>
        <span>
          / Medicines
        </span>
      </v-subheader>
      <v-card class="pa-4 mt-4">
        <v-row class="my-4 d-flex justify-end">
          <v-btn color="primary" @click="addMedicineDialog = true" class="mr-4" outlined>New <v-icon right>mdi-plus-box</v-icon></v-btn>
        </v-row>
        <v-row v-if="!medicinesExist"  justify="center">
          <div class="text-h6 text--lighten-1 mb-4 red--text">No Medicines yet</div>
        </v-row>
        <template >
          <v-data-table

              :search="search"
              :loading="dataLoading"
              loading-text="Loading medicines"
              :headers="headers"
              :items="items"
              :items-per-page="20"
              class="elevation-1 table"

          >
            <template v-slot:top>
              <v-row justify="center" class="px-4">
                <v-col cols="8" SM="12">

                  <v-text-field clearable  prepend-inner-icon="mdi-text-search" label="Search Medicine" v-model="search"
                                ></v-text-field>
                </v-col>
              </v-row>
            </template>

            <template v-slot:item.actions={item}>
              <v-row justify="center">
                <v-col cols="6" class="text-center">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn @click="editMedicineD(item)" v-bind="attrs" v-on="on" color="#09dca4"
                             outlined
                             size="30" icon>
                        <v-icon color="#09dca4">mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit Medicine</span>
                  </v-tooltip>
                </v-col>

                <v-col cols="6" class="text-center">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn @click="deleteMedicineD(item.id)" v-bind="attrs" v-on="on" color="red"
                             outlined size="30" icon>
                        <v-icon color="red">mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Delete Medicine</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </template>


          </v-data-table>
        </template>
      </v-card>
    </v-container>

    <!--------------------------    Add medicine Dialog   ------------------------------->
    <v-dialog v-model="addMedicineDialog" width="500">
      <v-card style="overflow: hidden !important;" class="py-6">
        <v-form ref="addMedicineForm" v-model="valid">
          <v-row justify="center" class=" text-center  text-caption" style="background-color: #2460bb !important;">
            <v-col>
              <div class="white--text " style="font-size: 15px !important;">Add new medicine</div>
            </v-col>
          </v-row>
          <v-row justify="center" class=" px-3">
            <v-col cols="12" sm="10">
              <v-text-field :error-messages="errors.scientific_name" @focus="errors.scientific_name = ''"
                            :rules="requireField" v-model="medicineForm.scientific_name"
                            label="scientific name"></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" class=" px-3">
            <v-col cols="12" sm="10">
              <v-text-field :error-messages="errors.trade_name" @focus="errors.trade_name = ''" :rules="requireField"
                            v-model="medicineForm.trade_name" label="trade name"></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" align="center">
            <v-btn @click="addMedicine" :disabled="!valid" color="primary">ADD</v-btn>

          </v-row>
        </v-form>

      </v-card>
    </v-dialog>


    <!--------------------------    Update medicine dialog   ----------------------------->

    <v-dialog v-model="editMedicineDialog" width="500">
      <v-card style="overflow: hidden !important;" class="py-6">
        <v-form ref="editMedicineForm" v-model="valid">
          <v-row justify="center" class=" text-center  text-caption" style="background-color: #2460bb !important;">
            <v-col>
              <div class="white--text " style="font-size: 15px !important;">Edit medicine</div>
            </v-col>
          </v-row>
          <v-row justify="center" class=" px-3">
            <v-col cols="12" sm="10">
              <v-text-field :error-messages="editErrors.trade_name" @focus="editErrors.trade_name = ''"
                            :rules="requireField" v-model="editMedicineForm.trade_name"
                            label="trade name"></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" class=" px-3">
            <v-col cols="12" sm="10">
              <v-text-field :error-messages="editErrors.scientific_name" @focus="editErrors.scientific_name = ''"
                            :rules="requireField" v-model="editMedicineForm.scientific_name"
                            label="scientific name"></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" align="center">
            <v-btn @click="editMedicine" :disabled="!valid" color="primary">Update</v-btn>

          </v-row>
        </v-form>

      </v-card>
    </v-dialog>


    <!------------------------------    Delete medicine dialog   ------------------------------------>
    <v-dialog width="400" v-model="deleteMedicineDialog">
      <v-card style="overflow: hidden !important;" width="400" height="150">
        <div class="text-caption text-center pt-6 red--text" style="font-size: 16px !important; ">Are you sure you want
          to delete this medicine
        </div>

        <v-card-text>
          <v-row class="mt-5" justify="center">

            <v-spacer></v-spacer>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="deleteMedicine" v-on="on" v-bind="attrs" outlined icon large color="red">
                  <v-icon color="red">mdi-check</v-icon>
                </v-btn>

              </template>
              <span>Are you sure!</span>
            </v-tooltip>

            <v-spacer></v-spacer>
            <v-tooltip bottom>

              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="deleteMedicineDialog = false" v-on="on" v-bind="attrs" outlined icon large color="green">
                  <v-icon color="green">mdi-close</v-icon>
                </v-btn>

              </template>
              <span>Cancel</span>

            </v-tooltip>

            <v-spacer></v-spacer>

          </v-row>
        </v-card-text>


      </v-card>
    </v-dialog>


  </div>
</template>

<script>
export default {
  name: "Medicines",
  data: () => ({
    valid: false,
    search: '',
    headers: [
      {text: 'Medicine ID', value: 'id', align: 'center'},
      {text: 'Trade name', value: 'trade_name', },
      {text: 'Scientific name',  value: 'scientific_name',},
      {text: 'Added', value: 'created_diff', sortable: false,},
      {text: 'Actions', value: 'actions', align: 'center' , sortable: false,},

    ],
    items: [],
    medicinesExist: true ,
    dataLoading: false,
    addMedicineDialog: false,
    editMedicineDialog: false,
    deleteMedicineDialog: false,
    medicineForm: {
      scientific_name: '',
      trade_name: ''
    },
    errors: [],
    editMedicineForm: {
      scientific_name: '',
      trade_name: ''
    },
    editErrors: [],
    deleteMedicineID: null,
    requireField: [
      (v) => !!v || 'field is required',
    ],


  }),
  methods: {
    getMedicines() {
      this.dataLoading = true
      this.axios.get('/medicines').then(res => {
        console.log(res)
        this.items = res.data
        this.medicinesExist = res.data.length > 0 ? true: false
        this.dataLoading = false
      }).catch(err => {

        console.log(err)
        this.dataLoading = false

      })
    },
    addMedicine() {
      this.axios.post('/medicines/add', this.medicineForm)
          .then(res => {
            console.log(res)
            this.$refs.addMedicineForm.reset()
            this.addMedicineDialog = false
            this.getMedicines()

          }).catch(err => {
        console.log(err.response)
        this.errors = err.response.data.errors
      })


    },
    editMedicineD(item) {
      console.log(item)
      this.editMedicineForm = {...item}
      this.editMedicineDialog = true
    },
    deleteMedicineD(id) {
      this.deleteMedicineID = id
      this.deleteMedicineDialog = true
    },

    deleteMedicine() {
      this.axios.post(`/medicines/delete/${this.deleteMedicineID}`)
          .then(() => {
            this.deleteMedicineDialog = false
            this.getMedicines()
          }).catch(err => {
        console.log(err)
      })

    },
    editMedicine() {
      this.axios.post(`/medicines/update/${this.editMedicineForm.id}`, this.editMedicineForm)
          .then(res => {
            console.log(res)
            this.$refs.editMedicineForm.reset()
            this.editMedicineDialog = false
            this.getMedicines()
          }).catch(err => {
        console.log(err)
        this.editErrors = err.response.data.errors
      })
    },

  },
  created() {
    this.getMedicines()
  },

}
</script>

<style scoped>
.v-data-table >>> tr {

  margin: 5px !important;
}
.v-data-table >>> .v-application--is-ltr .v-text-field .v-label {
  padding-left: 10px !important;
}

</style>
