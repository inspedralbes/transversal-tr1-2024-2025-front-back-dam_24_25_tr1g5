/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { VApp, VMain, VNavigationDrawer, VList, VListItem, VListItemTitle, VAppBar, VBtn } from 'vuetify/components';



// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VApp,
    VMain,
    VNavigationDrawer,
    VList,
    VListItem,
    VListItemTitle,
    VAppBar,
    VBtn,
  },
  theme: {
    defaultTheme: 'dark', 
  }
})
