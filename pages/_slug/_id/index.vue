<template>
  <v-card
    class="mx-auto"
    max-width="344"
  >
    <v-img
      :src="product.image"
      height="200px"
    ></v-img>

    <v-card-title>
     {{product.title}}
    </v-card-title>

    <v-card-subtitle>
      {{product.price}}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn
        color="orange lighten-2"
        text
      >
        Add To Cart
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        icon
        @click="show = !show"
      >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
        {{product.description}}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: "Product",
  data() {
    return {
      id: this.$route.params.id,
      product: {},
      show: false,
    };
  },

  fetch() {
    return this.$axios
      .$get(`https://fakestoreapi.com/products/${this.id}`)
      .then((result) => {
          console.log(result)
        this.product = result;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style lang="scss" scoped>
</style>