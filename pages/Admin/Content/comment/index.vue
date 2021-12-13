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
      <h3 class="mt-2">نظرات</h3>
      <div>
        <v-text-field append-icon="mdi-magnify"></v-text-field>
      </div>
    </v-flex>

    <Loading v-if="$fetchState.pending"/>
    <index v-else v-bind:comments="GET_COMMENTS"/>
  </section>
</template>

<script>
  import index from '@/components/Content/comment';
  import {mapGetters} from "vuex";

  export default {
    name: "comment",
    components: {
      index
    }
    ,
    data: () => ({
      items: [
        {
          text: "محتوا",
          disabled: false,
        },
        {
          text: "نظرات",
          disabled: true,
        },
      ],
    }),


    async fetch() {
      try {
        await this.$store.dispatch('Content/comment/getAllComments');
      } catch (e) {
        console.log(e)
      }
    },

    computed: {
      ...mapGetters('Content/comment', ['GET_COMMENTS']),
    },
  }
  ;
</script>

<style lang="scss" scoped>
</style>
