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
      <h3 class="mt-2">نظرات</h3>
      <div>
        <v-text-field append-icon="mdi-magnify"></v-text-field>
      </div>
    </v-flex>

    <index/>

  </section>
</template>

<script>
  import index from '@/components/Content/comment';

  export default {
    name: "comment",
    components: {
      index
    }
    ,
    data: () => ({
      items: [
        {
          text: "محتوا",
          disabled: false,
        },
        {
          text: "نظرات",
          disabled: true,
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
