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
        <h3 class="mt-2">تخفیف عمومی</h3>
        <div>
         <v-text-field append-icon="mdi-magnify"></v-text-field>
        </div>
      </v-flex>

      <index />
    
  </section>
</template>

<script>
import index from '@/components/Market/Discount/general.vue';
export default {
  components: { index },
  data: () => ({
    items: [
      {
        text: "مارکت",
        disabled: false,
        href: "/admin/market",
      },
       {
        text: "تخفیف ها ",
        disabled: false,
        href: "/admin/market/discount",
      },
      {
        text: "تخفیف عمومی",
        disabled: true,
        href: "/",
      },
    ],
  }),
};
</script>

<style lang="scss" scoped>
</style>