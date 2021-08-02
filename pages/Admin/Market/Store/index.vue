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
        <h3 class="mt-2">انبار</h3>
        <div>
         <v-text-field append-icon="mdi-magnify"></v-text-field>
        </div>
      </v-flex>

      <index />
    
  </section>
</template>

<script>
import index from '@/components/Market/Store/index.vue';
export default {
  components: { index },
  data: () => ({
    items: [
      {
        text: "انبار",
        disabled: false,
      },
      {
        text: "محصولات",
        disabled: true,
      },
    ],
  }),
};
</script>

<style lang="scss" scoped>
</style>
