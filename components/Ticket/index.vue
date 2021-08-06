<template>
  <v-data-table
    :headers="headers"
    :items="tickets"
    sort-by="id"
    class="elevation-1"
  >

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>تیکت ها </v-toolbar-title>
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

      <ActionIcon
        v-bind:icon="` mdi-eye`"
        v-bind:tooltip="`نمایش`"
        v-bind:item="item"
        v-on:click="showTicket(item)"
      />

    
    </template>

    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import ActionIcon from "../AppBarComponents/ActionIcon";
export default {
  components: {ActionIcon},
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
        { text: "#", value: "id" },
      { text: "عنوان", value: "title" },
      { text: "نویسنده", value: "user" },
      { text: "دسته", value: "category" },
      { text: "ارجاع از", value: "from" },
      { text: "اولویت", value: "priority" },
      { text: "تنظیمات", value: "actions", sortable: false },
    ],
    tickets: [],
    editedIndex: -1,
    editedItem: {
      title: "",
      user: "",
      category: "",
      from: "",
      priority: "",
    },
    defaultItem: {
      title: "",
      user: "",
      category: "",
      from: "",
      priority: "",
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
      this.tickets = [
        {
          id: "1",
          title: "خرابی",
          user: "سعید رستمی",
          category: "برقی",
          from: "یلیب",
          priority: "2",
  
        },

      
      ];
    },

    editItem(item) {
      this.editedIndex = this.tickets.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    showTicket(item) {
     console.log('showTicket');
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
        Object.assign(this.tickets[this.editedIndex], this.editedItem);
      } else {
        this.tickets.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style scoped>
</style>
