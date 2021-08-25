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
      <h3 class="mt-2">فروش شگفت انگیز</h3>
      <div>
        <v-text-field append-icon="mdi-magnify"></v-text-field>
      </div>
    </v-flex>

    <index/>

  </section>
</template>

<script>
  import index from '@/components/Market/Discount/amazing.vue';

  export default {
    components: {index},
    data: () => ({
      items: [
        {
          text: "مارکت",
          disabled: false,
        },
        {
          text: "تخفیف ها ",
          disabled: false,
        },
        {
          text: "فروش شگفت انگیز",
          disabled: true,
        },
      ],
    }),
  };
</script>

<style lang="scss" scoped>
</style>
