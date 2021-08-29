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
      <h3 class="mt-2">سوالات متداول</h3>
      <div>
        <v-text-field append-icon="mdi-magnify"></v-text-field>
      </div>
    </v-flex>


    <Loading v-if="$fetchState.pending"/>
    <index v-else v-bind:faqs="GET_FAQS"/>

  </section>
</template>

<script>
  import index from '@/components/Content/faq';
  import {mapGetters} from "vuex";
  import Loading from "@/components/CustomComponent/Loading";

  export default {
    name: "faq",
    components: {Loading, index},
    data: () => ({
      items: [
        {
          text: "مارکت",
          disabled: false,
        },
        {
          text: "سوالات متداول",
          disabled: true,
        },
      ],
    }),

    async fetch() {
      try {
        await this.$store.dispatch('Content/faq/getAllFaqs');
      } catch (e) {
        console.log(e)
      }
    },

    computed: {
      ...mapGetters('Content/faq', ['GET_FAQS']),
    },
  };
</script>

<style lang="scss" scoped>
</style>
