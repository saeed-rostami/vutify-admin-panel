import Vue from 'vue'

import Snackbar from '@/components/CustomComponent/SnackBar.vue'
import Loading from "@/components/CustomComponent/Loading";

const components = {Snackbar, Loading};

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
});
