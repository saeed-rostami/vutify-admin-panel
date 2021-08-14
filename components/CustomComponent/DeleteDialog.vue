<template>

  <v-dialog v-model="dialogDelete" max-width="500px">


    <v-card>
      <v-card-title class="text-h5">آیا از حذف این آیتم اطمینان دارید؟</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDelete">لغو</v-btn>
        <v-btn
          color="blue darken-1" text @click="deleteItemConfirm">بله
        </v-btn>

        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>


  </v-dialog>

</template>

<script>
  export default {
    name: "DeleteDialog",
    props: {
      dialogDelete: {
        type: Boolean,
        required: true
      },


    },
    methods: {
      closeDelete() {
        this.$emit('closeDelete')
      },

      deleteItemConfirm() {
        this.$emit('deleteItemConfirm')
      },
    }
  }
</script>

<style scoped>

</style>
