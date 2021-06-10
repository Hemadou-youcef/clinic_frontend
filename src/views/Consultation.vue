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

    <v-card class="rounded-lg mb-2">
      <v-card-title>
        <v-icon class="mr-2">
          mdi-heart-pulse
        </v-icon>
        Detail Consultation
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            outlined
        >
          <v-icon color="primary">
            mdi-file-settings
          </v-icon>
          ADD PRESCRIPTION
        </v-btn>
        <v-btn
            color="teal"
            class="ml-2"
            outlined
        >
          <v-icon color="teal">
            mdi-pencil
          </v-icon>
          Edit
        </v-btn>
        <v-btn
            color="red"
            class="ml-2"
            outlined
        >
          <v-icon color="red">
            mdi-delete-outline
          </v-icon>
          Delete
        </v-btn>
      </v-card-title>

    </v-card>
    <v-row>
      <v-col cols="8">
        <v-card class="rounded-lg">
          <v-card-text>
            <v-card-title class="px-0 py-2">
              <v-icon class="mr-2">
                mdi-clipboard-pulse-outline
              </v-icon>
              Reasons
            </v-card-title>
            <v-chip-group

                column
                class="mb-2"
            >
              <v-chip
                  v-for="tag in tags"
                  color="red"
                  class="font-weight-bold white--text"
                  :key="tag"
              >
                {{ tag }}
              </v-chip>
            </v-chip-group>
            <v-card-title class="px-0 py-2">
              <v-icon class="mr-2">
                mdi-emoticon-sick-outline
              </v-icon>
              Detail
            </v-card-title>

            <v-textarea
                class="mb-5 pa-3 elevation-2"
                color="white"
                name="input-7-4"
                label="Detail"
                value="The patient suffered from severe pain in the abdomen."
                outlined
                auto-grow
                hide-details
                disabled
            ></v-textarea>

            <v-card-title class="px-0 py-2">
              <v-icon class="mr-2">
                mdi-stethoscope
              </v-icon>
              traitement
            </v-card-title>
            <v-textarea
                class="mb-5 elevation-0 rounded-0 font-weight-bold"
                background-color="grey lighten-4"
                color="white"
                name="input-7-4"
                value="Additional analyzes were requested; while waiting for the results, stop the treatment administered the last time,."
                solo
                outlined
                auto-grow
                hide-details
                readonly
            ></v-textarea>
            <v-card-title class="pa-0 pt-2">
              <v-icon class="mr-2">
                mdi-human-male-height
              </v-icon>
              Examinations
            </v-card-title>
            <v-list>
              <v-list-item class="primary rounded-t-lg font-weight-bold">
                <v-list-item-content>
                  <v-list-item-title class="white--text">
                    Examination
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-content>
                  <v-list-item-title class="white--text">
                    result
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item style="border-bottom: 2px solid #ccc" class="rounded-b-lg">
                <v-list-item-content>
                  <v-list-item-title>
                    weight
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-content>
                  <v-list-item-title>
                    70 Kg
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="border-bottom: 2px solid #ccc" class="rounded-b-lg">
                <v-list-item-content>
                  <v-list-item-title>
                    length
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-content>
                  <v-list-item-title>
                    186 cm
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="rounded-lg mb-2">
          <v-card-title>
            <v-icon class="mr-2">
              mdi-account
            </v-icon>
            Patient info
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-avatar class="rounded-lg mr-2" size="100">
                  <v-img :src="`http://localhost:8000/images/patients/male/2.jpg`"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold text-h6" style="text-align: center">
                    Ryan Quitzon
                  </v-list-item-title>

                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        <v-card class="rounded-lg">
          <v-card-title>
            <v-icon class="mr-2">
              mdi-calendar
            </v-icon>
            Appointment info
            <v-spacer></v-spacer>
            <v-btn
                outlined
                color="primary"
            >
              <v-icon color="primary">
                mdi-open-in-new
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold text-h6" style="text-align: center">
                    2021-05-31 06:33 PM
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>

export default {
  name: "Consultation",
  data: ()=>({

    tags: [
      'Abdominal pain '
    ],
  })
}
</script>

<style scoped>

</style>