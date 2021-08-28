<template>
  <section>
    <div>
      <v-breadcrumbs :items="items">
        <template v-slot:divider>
          <v-icon>mdi-chevron-left</v-icon>
        </template>
      </v-breadcrumbs>
    </div>

    <v-divider></v-divider>


    <v-flex class="d-flex justify-space-between">
      <h3 class="mt-2">منو ها</h3>
      <div>
        <v-text-field append-icon="mdi-magnify"></v-text-field>
      </div>
    </v-flex>
    <Loading v-if="$fetchState.pending"/>
    <index v-else v-bind:menus="GET_Menus"/>

  </section>
</template>

<script>
  import index from '@/components/Content/menu';
  import {mapGetters} from "vuex";


  export default {
    name: "menu",
    components: {index},


    data: () => ({
      items: [
        {
          text: "مارکت",
          disabled: false,
        },
        {
          text: "منو ها",
          disabled: true,
        },
      ],
    }),

    async fetch() {
      try {
        await this.$store.dispatch('Content/menu/getAllMenus');
      } catch (e) {
        console.log(e)
      }
    },

    computed: {
      ...mapGetters('Content/menu', ['GET_Menus']),
    },
  };
</script>

<style lang="scss" scoped>
</style>
