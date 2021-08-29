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
        <h3 class="mt-2">پیج ساز</h3>
        <div>
         <v-text-field append-icon="mdi-magnify"></v-text-field>
        </div>
      </v-flex>
    <Loading v-if="$fetchState.pending"/>
      <index v-else v-bind:pages="GET_Pages" />
    
  </section>
</template>

<script>
import index from '@/components/Content/page';
import {mapGetters} from "vuex";
export default {
  name: "page",
  components: { index },
  data: () => ({
    items: [
      {
        text: "مارکت",
        disabled: false,
      },
      {
        text: "پیج ساز",
        disabled: true,
      },
    ],
  }),

  async fetch() {
    try {
      await this.$store.dispatch('Content/page/getAllPages');
    } catch (e) {
      console.log(e)
    }
  },

  computed: {
    ...mapGetters('Content/page', ['GET_Pages']),
  },
};
</script>

<style lang="scss" scoped>
</style>
