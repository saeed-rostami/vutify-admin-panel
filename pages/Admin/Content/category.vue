<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
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
      <h3 class="mt-2">دسته بندی</h3>
      <div>
        <v-text-field append-icon="mdi-magnify"></v-text-field>
      </div>
    </v-flex>

    <Loading v-if="$fetchState.pending"/>
    <index v-else v-bind:categories="GET_POST_CATEGORIES"/>

  </section>
</template>

<script>
  import index from '@/components/Content/category';
  import {mapGetters} from 'vuex'

  export default {
    name: "category",
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
          text: "دسته بندی",
          disabled: true,
        },
      ],
    }),

    async fetch() {
      try {
        await this.$store.dispatch('Content/category/getAllPostCategories');
      } catch (e) {
        console.log(e)
      }
    },

    computed: {
      ...mapGetters('Content/category', ['GET_POST_CATEGORIES']),
    },

  }
  ;
</script>

<style lang="scss" scoped>
</style>
