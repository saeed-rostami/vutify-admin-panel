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
      <h3 class="mt-2">تیکت های بسته</h3>
      <div>
        <v-text-field append-icon="mdi-magnify"></v-text-field>
      </div>
    </v-flex>

    <index/>

  </section>
</template>

<script>
  import index from '@/components/Ticket/index.vue';

  export default {
    name: "new",
    components: {
      index
    }
    ,
    data: () => ({
      items: [
        {
          text: "تیکت ها",
          disabled: false,
          href: "admin/ticket",
        },
        {
          text: "تیکت های بسته",
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
