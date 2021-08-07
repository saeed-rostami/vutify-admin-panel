<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon

        v-bind="attrs"
        v-on="on"
        small
        class="mr-2"
        v-on:click="event"
      >
        {{icon}}
      </v-icon>
    </template>
    <span>{{tooltip}}</span>
  </v-tooltip>

</template>

<script>
  export default {
    name: "ActionIcon",
    props: {
      icon: {
        type: String,
        required: true,
      },

      tooltip: {
        type: String,
        required: true,
      },
      item: {
        type: Object,
        required: false,
      },
    },
    methods: {
      event() {
        this.$emit('click', this.item)
      }
    }
  }
</script>

<style scoped>

</style>
