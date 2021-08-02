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
        <h3 class="mt-2">برند ها</h3>
        <div>
         <v-text-field append-icon="mdi-magnify"></v-text-field>
        </div>
      </v-flex>

      <index />
    
  </section>
</template>

<script>
import index from '@/components/Market/Brand/index.vue';
export default {
  components: { index },
  data: () => ({
    items: [
      {
        text: "مارکت",
        disabled: false,
      },
      {
        text: "برند ها",
        disabled: true,
      },
    ],
  }),
};
</script>

<style lang="scss" scoped>
</style>
