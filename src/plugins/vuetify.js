import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from "vuetify/es5/util/colors";
Vue.use(Vuetify);

export default new Vuetify({
    theme:{
        // dark : true
        themes: {
            light: {
                primary: colors.blue,
                secondary: "#09dca4" ,
                accent: colors.shades.black,
                error: colors.red.accent3,
                background: colors.indigo.lighten5
            },
            dark: {
                primary: colors.blue.lighten3,
                background: colors.indigo.base
            }
        }
    }
});
