import Vue from 'vue'

import Snackbar from '@/components/CustomComponent/SnackBar.vue'
const components = { Snackbar };

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
});
