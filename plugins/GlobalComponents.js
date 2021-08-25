import Vue from 'vue'

import Loading from "@/components/CustomComponent/Loading";
import Select2 from 'vue-select';

const components = { Loading};

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
});

if (process.browser) {
  Vue.component('Select2', Select2)
}
