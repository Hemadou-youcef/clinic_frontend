<template>
  <v-card
      class="mx-auto pa-2 pb-0 px-0"
      max-width="800"

  >
    <v-card-text class="p-2">
      <div>
        <v-form v-model="valid" ref="form">
<!--          <v-overflow-btn-->
<!--              class="my-2"-->
<!--              :items="patients"-->
<!--              editable-->
<!--              label="patient"-->
<!--              v-model="patientName"-->
<!--              :rules="patientRule"-->
<!--              :disabled="timed || loadingInfo || revisitApp"-->
<!--              :loading="loadingInfo"-->
<!--          >-->
<!--          </v-overflow-btn>-->
          <v-list class="my-2 pa-0">
            <v-list-item class="pa-0 font-weight-bold rounded-0" style="text-align: center">
              <v-list-item-content class="pa-0">
                <v-overflow-btn
                    class="my-0"
                    editable
                    hide-details
                    background-color="white"
                    label="appointment Date"
                >
                </v-overflow-btn>
              </v-list-item-content>
              <v-list-item-content class="pa-0">
                <v-overflow-btn
                    class="my-0"
                    editable
                    hide-details
                    background-color="white"
                    label="Appointment Time"
                >
                </v-overflow-btn>
              </v-list-item-content>
              <v-list-item-content class="pa-0">
                <v-overflow-btn
                    class="my-0"
                    editable
                    hide-details
                    disabled
                    background-color="white"
                    label="patient"
                >
                </v-overflow-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        <v-row>
          <v-col>
<!--            <v-sheet color="primary" class="pa-2 white&#45;&#45;text font-weight-bold text-h5">-->
<!--                  <span class="align-self-center">-->
<!--                    Appointment-->
<!--                  </span>-->
<!--            </v-sheet>-->
            <v-sheet class="elevation-0 pa-1 rounded-lg" >

              <v-text-field
                  background-color="white"
                  label="Motif"
                  hide-details
                  placeholder="Motif"
                  prepend-icon="mdi-clipboard-pulse-outline"
                  class="mb-2"
                  outlined
              ></v-text-field>
              <v-textarea
                  outlined
                  auto-grow
                  clearable
                  hide-details
                  background-color="white"
                  name="input-7-4"
                  label="Detail"
                  prepend-icon="mdi-emoticon-sick-outline"
                  value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
                  class="mb-5"
              ></v-textarea>
              <v-textarea
                  outlined
                  auto-grow
                  clearable
                  hide-details
                  background-color="white"
                  name="input-7-4"
                  label="Traitement"
                  prepend-icon="mdi-stethoscope"
                  value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
                  class="mb-2"
              ></v-textarea>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet class="elevation-1 pa-0 rounded-lg" >
              <v-list class="py-0">
                <v-list-item class="primary font-weight-bold" style="text-align: center">
                  <v-list-item-content>
                    <v-list-item-title class="white--text text-h6">
                      Examination
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                        color="white"

                        icon>
                      <v-icon color="white">
                        mdi-plus
                      </v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>

                <v-list-item class="pa-2">
                  <v-list-item-content class=" ma-0 pa-1">
                    <v-text-field
                        hide-details
                        placeholder="exam"
                        class="rounded-0"
                        outlined
                    ></v-text-field>
                  </v-list-item-content>

                  <v-list-item-content class="ma-0 pa-1">
                    <v-text-field
                        hide-details
                        placeholder="result"
                        class="rounded-0"
                        outlined
                    ></v-text-field>
                  </v-list-item-content>
                  <v-list-item-action class="ma-0 ml-1 fill-height">
                    <v-btn
                        class="fill-height"
                        color="red">
                      <v-icon color="white">
                        mdi-minus
                      </v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-sheet>

          </v-col>
        </v-row>

          <v-layout justify-space-between>
            <v-spacer></v-spacer>
            <v-btn v-if="!timed" @click="CheckAvailable(true)" :loading="Submitloading" :disabled="!valid"  :class=" { 'blue darken-1 white--text' : valid, 'disabled': !valid }">
              ADD CONSULTATION
              <v-icon color="white" class="pl-2">mdi-plus-box</v-icon>
            </v-btn>
            <div v-else >
              <v-btn @click="CheckAvailable(false)" :loading="Editloading" :disabled="!valid" color="teal darken-2" :class=" { ' white--text' : valid, 'disabled': !valid }">
                EDIT CONSULTATION
                <v-icon color="white" class="pl-2">mdi-pencil</v-icon>
              </v-btn>
              <v-btn @click="deleteAppointment" :loading="Deleteloading" :disabled="!valid" color="red" class="ml-2" :class=" { ' white--text' : valid}">
                DELETE
                <v-icon color="white" class="pl-2">mdi-delete-outline</v-icon>
              </v-btn>
            </div>


            <v-spacer></v-spacer>

          </v-layout>
        </v-form>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "AddAppointment",
  props: [

  ],
  data () {
    return {

    }
  },
  computed: {
  },
  methods: {
  },
  created() {

  }
}
</script>

<style>
.custom-green .v-input--selection-controls__input div {
  color: #009688 !important;
}
</style>