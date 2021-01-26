<template>

  <v-layout row>
    <v-col md6 v-for="post in posts" v-bind:key="post.id">
        <h1>
          {{ post.title }}
        </h1>
    </v-col>
  </v-layout>

</template>

<script>
export default {
  data() {
    return {
      posts: [],
      title: this.$route.params.title,
    };
  },
  fetch() {
    return this.$axios
      .$get("http://127.0.0.1:8000/api/" + this.title)
      .then((result) => {
        this.posts = {...result.posts.data};
        console.log(this.posts);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style lang="scss" scoped>
</style>