<template></template>
<script>
  import Notiflix from "notiflix";

  export default {
    name: "Loding",
    created() {
      Notiflix.Loading.dots();
    },
    beforeDestroy() {
      Notiflix.Loading.remove();
    }
  }
</script>

<style scoped>

</style>
