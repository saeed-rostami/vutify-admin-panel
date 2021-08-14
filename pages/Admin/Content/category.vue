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

    <index v-bind:categories="categories"/>

  </section>
</template>

<script>
  import index from '@/components/Content/category';

  export default {
    name: "category",
    components: {
      index
    }
    ,
    data: () => ({
      categories: [],
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


    created() {
      this.$axios.$get('http://localhost:8000/admin/content/category', {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response => {
        console.log(response)
        this.categories = response.categories;
      })).catch((error) => {
        console.log(error)
      });

    }
    ,
  }
  ;
</script>

<style lang="scss" scoped>
</style>
