<template>
  <v-layout row justify-center align-center>
    <p v-if="$fetchState.pending">Loding...</p>

    <v-col v-else md3 v-for="product in products" v-bind:key="product.id">
      <nuxt-link :to="`products/${product.id}`">
        <v-card class="mx-auto" max-width="400">
          <v-img
            class="white--text align-end"
            height="200px"
            v-bind:src="product.image"
          >
          </v-img>

          <v-card-subtitle class="pb-0">
            {{ product.price }}
          </v-card-subtitle>

          <v-card-text class="text--primary">
            <div>{{ product.title }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn color="orange" text> Add To Cart </v-btn>
          </v-card-actions>
        </v-card>
      </nuxt-link>
    </v-col>
  </v-layout>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      slug: this.$route.params.slug,
      products: [],
    };
  },

  fetch() {
    return this.$axios
      .$get(`https://fakestoreapi.com/products/category/${this.slug}`)
      .then((result) => {
        this.products = result;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style scoped>
</style>
