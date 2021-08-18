<template>
  <v-snackbar v-bind:value="showSnackbar" :color="color" :top="'top'">
    {{ text }}

    <!--<template v-slot:action="{ attrs }">-->
      <!--<v-btn dark text v-bind="attrs" @click="showSnack = !showSnack">-->
        <!--بستن-->
      <!--</v-btn>-->
    <!--</template>-->
  </v-snackbar>
</template>

<script>
  export default {
    name: "SnackBar",
    props: {
      color: {
        type: String,
        default: 'orange darken-2'
      },
      text: {
        type: String,
        required: true
      },
      show: {
        type: Boolean,
        required: true,
        default: false
      }
    },
    data() {
      return {
        timeout: 3000,
      }
    },
    computed: {
      showSnackbar() {
        return !!this.show;
      }
    }

  }
</script>

<style scoped>

</style>
