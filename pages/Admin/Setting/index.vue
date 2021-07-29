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
      <h3 class="mt-2">تنظیمات</h3>
      <div>
        <v-text-field append-icon="mdi-magnify"></v-text-field>
      </div>
    </v-flex>

    <index/>

  </section>
</template>

<script>
  import index from '@/components/Setting/index';

  export default {
    name: "admin",
    components: {
      index
    }
    ,
    data: () => ({
      items: [
        {
          text: "تنظیمات",
          disabled: false,
          href: "admin/setting",
        },

        {
          text: "تنظیمات",
          disabled: true,
          href: "/",
        },
      ],
    }),


    created() {
      console.log('send api');
    }
    ,
  }
  ;
</script>

<style lang="scss" scoped>
</style>
