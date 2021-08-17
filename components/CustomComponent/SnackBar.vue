<template>
  <div name="snackbars">
    <v-snackbar v-model="show" :color="color" :top="'top'">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="show = false">
          بستن
        </v-btn>
      </template>
    </v-snackbar>
  </div>
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
      show : {
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
  }
</script>

<style scoped>

</style>
