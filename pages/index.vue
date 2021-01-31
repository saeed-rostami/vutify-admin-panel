<template>
  <v-layout row>
    <v-col md6 v-for="category in categories" v-bind:key="category.id">
      <nuxt-link v-bind:to="`${category.slug}`">
        <h1>
          {{ category.title }}
        </h1>
      </nuxt-link>
    </v-col>
  </v-layout>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      categories: [],
    };
  },

  fetch() {
    return this.$axios
      .$get("http://127.0.0.1:8000/api/")
      .then((result) => {
        console.log(result.categories);
        this.categories = result.categories;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
