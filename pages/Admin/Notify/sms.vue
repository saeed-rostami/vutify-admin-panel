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
      <h3 class="mt-2">اعلانیه های پیامکی</h3>
      <div>
        <v-text-field append-icon="mdi-magnify"></v-text-field>
      </div>
    </v-flex>

    <index/>

  </section>
</template>

<script>
  import index from '@/components/Notify/smsNotify';

  export default {
    name: "admin",
    components: {
      index
    }
    ,
    data: () => ({
      items: [
        {
          text: "کاربران",
          disabled: false,
          href: "admin/notify",
        },
        {
          text: "اعلانیه های پیامکی",
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
