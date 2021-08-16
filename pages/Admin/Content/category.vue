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
      <h3 class="mt-2">دسته بندی</h3>
      <div>
        <v-text-field append-icon="mdi-magnify"></v-text-field>
      </div>
    </v-flex>

    <index v-bind:categories="GET_POST_CATEGORIES"/>

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

    async asyncData({store}) {
      try {
        await store.dispatch('Content/category/getAllPostCategories')
      } catch (e) {
        console.log(e)
      }
    },

    computed: {
      ...mapGetters('Content/category', ['GET_POST_CATEGORIES']),
    },


    // created() {
    //   this.$getPostCategories.then((response => {
    //     console.log(response);
    //     this.categories = response.categories;
    //   })).catch((error) => {
    //     console.log(error)
    //   });
    //
    // },
  }
  ;
</script>

<style lang="scss" scoped>
</style>
