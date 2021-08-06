<template>
  <v-data-table
    :headers="headers"
    :items="orders"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:item.image="{ item }">
      <v-avatar>
        <img :src="item.image" alt="alt"/>
      </v-avatar>
    </template>

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>سفارشات</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn disabled color="primary" dark class="mb-2 disabled" v-bind="attrs" v-on="on">
              ایجاد
            </v-btn>
          </template>
          <v-card>
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
                  <v-col cols="12" sm="6" md="4">
                    <v-file-input
                      v-model="editedItem.image"
                      label="تصویر"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.price"
                      label="قیمت"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.weight"
                      label="وزن"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="editedItem.category"
                      label="دسته"
                      v-bind:items="selectOptions"
                    >
                    </v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.property"
                      label="فرم"
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col cols="12" sm="6" md="4"> </v-col> -->
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> لغو</v-btn>
              <v-btn color="blue darken-1" text @click="save"> ایجاد</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
            >آیا از حذف این آیتم اطمینان دارید؟
            </v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">لغو</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
              >بله
              </v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">

      <div class="d-flex flex-inline">
      <ActionIcon
        v-bind:icon="`mdi-close-thick`"
        v-bind:tooltip="`باطل کردن سفارش`"
        v-bind:item="item"
        v-on:click="rejectOrder(item)"
      />

      <ActionIcon
        v-bind:icon="` mdi-receipt`"
        v-bind:tooltip="`مشاهده فاکتور`"
        v-bind:item="item"
        v-on:click="showReceipt(item)"
      />

      <ActionIcon
        v-bind:icon="` mdi-truck-delivery`"
        v-bind:tooltip="`وضعیت ارسال`"
        v-bind:item="item"
        v-on:click="checkDelivery(item)"
      />

      <ActionIcon
        v-bind:icon="`  mdi-calendar-edit`"
        v-bind:tooltip="`تغییر وضعیت سفارش`"
        v-bind:item="item"
        v-on:click="changeDelivery(item)"
      />
      </div>

    </template>

    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import ActionIcon from "../../AppBarComponents/ActionIcon";

  export default {
    components: {ActionIcon},
    data: () => ({
      selectOptions: ["Foo", "Bar", "Fizz", "Buzz"],
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "کد سفارش", value: "id"},
        {text: "مبلغ سفارش", value: "price"},
        {text: "مبلغ تخفیف", value: "discount"},
        {text: "مبلغ نهایی", value: "final_price"},
        {text: "وضعیت پرداخت", value: "payment_status"},
        {text: "شیوه پرداخت", value: "payment_method"},
        {text: "بانک", value: "bank"},
        {text: "وضعیت ارسال", value: "delivery_status"},
        {text: "شیوه ارسال", value: "delivery_method"},
        {text: "وضعیت سفارش", value: "order_status"},
        {text: "تنظیمات", value: "actions", sortable: false},
      ],
      orders: [],
      editedIndex: -1,
      editedItem: {
        id: "",
        price: "",
        discount: "",
        final_price: "",
        payment_status: "",
        payment_method: "",
        bank: "",
        delivery_status: "",
        delivery_method: "",
        order_status: "",
      },
      defaultItem: {
        id: "",
        price: "",
        discount: "",
        final_price: "",
        payment_status: "",
        payment_method: "",
        bank: "",
        delivery_status: "",
        delivery_method: "",
        order_status: "",
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
        this.orders = [
          {
            id: "1",
            price: "50000",
            discount: "30",
            final_price: "4500",
            payment_status: "1",
            payment_method: "1",
            bank: "ملی",
            delivery_status: "2",
            delivery_method: "پست",
            order_status: "ارسال",
          },
        ];
      },

      editItem(item) {
        this.editedIndex = this.orders.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        this.editedIndex = this.orders.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        this.orders.splice(this.editedIndex, 1);
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
          Object.assign(this.orders[this.editedIndex], this.editedItem);
        } else {
          this.orders.push(this.editedItem);
        }
        this.close();
      },
    },
  };
</script>

<style scoped>
</style>
