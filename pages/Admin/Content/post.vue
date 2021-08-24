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
      <h3 class="mt-2">پست ها</h3>
      <div>
        <v-text-field append-icon="mdi-magnify"></v-text-field>
      </div>
    </v-flex>

    <Loading v-if="$fetchState.pending"/>
    <index
      v-else
      v-bind:categories="GET_POST_CATEGORIES"
      v-bind:posts="GET_POSTS"
    />

  </section>
</template>

<script>
  import index from '@/components/Content/post';
  import {mapGetters} from 'vuex'

  export default {
    name: "post",
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
          text: "پست ها",
          disabled: true,
        },
      ],
    }),


    async asyncData({store}) {
      try {
        await store.dispatch('Content/category/getAllPostCategories');
      } catch (e) {
        console.log(e)
      }
    },

    async fetch() {
      try {
        await this.$store.dispatch('Content/post/getAllPosts');
      } catch (e) {
        console.log(e)
      }
    },

    computed: {
      ...mapGetters('Content/category', ['GET_POST_CATEGORIES']),
      ...mapGetters('Content/post', ['GET_POSTS']),
    },
  };
</script>

<style lang="scss" scoped>
</style>
