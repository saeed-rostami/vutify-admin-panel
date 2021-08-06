<template>
  <v-data-table
    :headers="headers"
    :items="payments"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title> پرداخت ها</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn disabled color="primary" dark class="mb-2 disabled" v-bind="attrs" v-on="on">
              ایجاد
            </v-btn>
          </template>
          <!-- <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.name"
                      label="نام"
                    ></v-text-field>
                  </v-col>
                 
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> لغو </v-btn>
              <v-btn color="blue darken-1" text @click="save"> ایجاد </v-btn>
            </v-card-actions>
          </v-card> -->
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
        v-on:click="showComment(item)"
      />

      <ActionIcon
        v-bind:icon="`mdi-cancel`"
        v-bind:tooltip="`باطل کردن`"
        v-bind:item="item"
        v-on:click="cancelPayment(item)"
      />


      <ActionIcon
        v-bind:icon="` mdi-arrow-left`"
        v-bind:tooltip="`برگرداندن`"
        v-bind:item="item"
        v-on:click="rejectPayment(item)"
      />

    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import ActionIcon from "../../AppBarComponents/ActionIcon";
export default {
  components: {ActionIcon},
  data: () => ({
   

    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "#", value: "id" },
      { text: "کد تراکنش", value: "transaction_id" },
      { text: " پرداخت کننده", value: "payer" },
      { text: "بانک", value: "bank" },
      { text: "وضعیت", value: "status" },
      { text: "نوع", value: "type" },

      { text: "تنظیمات", value: "actions", sortable: false },
    ],
    payments: [],
    editedIndex: -1,
    editedItem: {
      transaction_id: "",
      payer: "",
      bank: "",
      status: "",
      type: "",
    },
    defaultItem: {
      transaction_id: "",
      payer: "",
      bank: "",
      status: "",
      type: "",
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
      this.payments = [
        {
          id: "1",
          transaction_id: "20",
          payer: "سعید رستمی",
          bank: "ملت",
          status: "2",
          type: "2",
        },
      ];
    },

    editItem(item) {
      this.editedIndex = this.payments.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.payments.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.payments.splice(this.editedIndex, 1);
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
        Object.assign(this.payments[this.editedIndex], this.editedItem);
      } else {
        this.payments.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style scoped>
</style>
