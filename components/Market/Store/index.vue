<template>
  <v-data-table
    :headers="headers"
    :items="stores"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:item.image="{ item }">
      <v-avatar>
        <img :src="item.image" alt="alt" />
      </v-avatar>
    </template>

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>انبار </v-toolbar-title>
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
             mdi-database-edit
          </v-icon>
        </template>
        <span>اصلاح موجودی</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" small @click="deleteItem(item)">
            mdi-database-plus
          </v-icon>
        </template>
        <span>افزایش موجودی</span>
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
  
    dialog: false,
    dialogDelete: false,
    headers: [
        { text: "#", value: "id" },
      { text: " نام محصول", value: "name" },
      { text: " تصویر محصول", value: "image" },
      { text: "موجودی", value: "exist" },
      { text: "ورودی", value: "import" },
      { text: "خروجی", value: "export" },
      { text: "تنظیمات", value: "actions", sortable: false },
    ],
    stores: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      image: "",
      exist: "",
      import: "",
      export: "",
    
    },
    defaultItem: {
         name: "",
      image: "",
      exist: "",
      import: "",
      export: "",
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
      this.stores = [
        {
          id: "1",
          name: "Iphone",
          image: "https://cdn.vuetifyjs.com/images/john.jpg",
          exist: "بله",
          import: "19",
          export: "15",
        
        },

    
      ];
    },

    editItem(item) {
      this.editedIndex = this.stores.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.stores.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.stores.splice(this.editedIndex, 1);
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
        Object.assign(this.stores[this.editedIndex], this.editedItem);
      } else {
        this.stores.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style scoped>
</style>