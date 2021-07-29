<template>
  <v-data-table
    :headers="headers"
    :items="comments"
    sort-by="name"
    class="elevation-1"
  >

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>نظرات </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn disabled color="primary" dark class="mb-2 disabled" v-bind="attrs" v-on="on">
              ایجاد
            </v-btn>
          </template>
       
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >آیا از حذف این آیتم اطمینان دارید؟</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">لغو</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >بله</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            v-on="on"
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-eye
          </v-icon>
        </template>
        <span>نمایش</span>
      </v-tooltip>

       <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            v-on="on"
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-check-outline
          </v-icon>
        </template>
        <span>تایید</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" small @click="deleteItem(item)">
            mdi-close
          </v-icon>
        </template>
        <span>عدم تایید</span>
      </v-tooltip>

    
    </template>

    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    selectOptions: ["Foo", "Bar", "Fizz", "Buzz"],
    dialog: false,
    dialogDelete: false,
    headers: [
        { text: "#", value: "id" },
      { text: "شناسه کاربر", value: "user_id" },
      { text: "نام کاربر", value: "user_name" },
      { text: "شناسه کالا", value: "product_id" },
      { text: "نام کالا", value: "product_name" },
      { text: "وضعیت", value: "status" },
      { text: "تنظیمات", value: "actions", sortable: false },
    ],
    comments: [],
    editedIndex: -1,
    editedItem: {
      user_id: "",
      user_name: "",
      product_id: "",
      product_name: "",
      status: "",
    },
    defaultItem: {
     user_id: "",
      user_name: "",
      product_id: "",
      product_name: "",
      status: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "ایجاد" : "ویرایش";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.comments = [
        {
          id: "1",
          user_id: "65",
          user_name: "saeed",
          product_id: "200",
          product_name: "Iphone",
          status: "confirmed",
  
        },

      
      ];
    },

    editItem(item) {
      this.editedIndex = this.comments.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.comments.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.comments.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.comments[this.editedIndex], this.editedItem);
      } else {
        this.comments.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style scoped>
</style>
