<template>
  <v-data-table
    :headers="headers"
    :items="coupons"
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
        <v-toolbar-title>کوپن تخفیف </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
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
                      v-model="editedItem.coupon_id"
                      label="کد کوپن"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.percent"
                      label="درصد تخفیف"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.max"
                      label="سقف تخفیف"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.type"
                      label="نوع کوپن"
                    ></v-text-field>
                  </v-col>



<!-- START -->

                  <v-col cols="12" sm="6" md="4">
                    <v-menu
                      v-model="startDatePicker"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.start"
                          label="تاریخ شروع"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.start"
                        @input="startDatePicker = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <!-- EDN -->
                   <v-col cols="12" sm="6" md="4">
                    <v-menu
                      v-model="endDatePicker"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.end"
                          label="تاریخ پایان"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.end"
                        @input="endDatePicker = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> لغو </v-btn>
              <v-btn color="blue darken-1" text @click="save"> ایجاد </v-btn>
            </v-card-actions>
          </v-card>
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
            mdi-pencil
          </v-icon>
        </template>
        <span>ویرایش</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <span>حذف</span>
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
    startDatePicker: false,
    endDatePicker: false,
    selectOptions: ["Foo", "Bar", "Fizz", "Buzz"],
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "#", value: "id" },
      { text: "کد کوپن", value: "coupon_id" },
      { text: "درصد تخفیف", value: "percent" },
      { text: "سقف تخفیف", value: "max" },
      { text: "نوع کوپن", value: "type" },
      { text: "تاریخ شروع", value: "start" },
      { text: "تاریخ پایان", value: "end" },

      { text: "تنظیمات", value: "actions", sortable: false },
    ],
    coupons: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      coupon_id: "",
      percent: "",
      max: "",
      type: "",
      start: "",
      end: "",
    },
    defaultItem: {
      id: "",
      coupon_id: "",
      percent: "",
      max: "",
      type: "",
      start: "",
      end: "",
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
      this.coupons = [
        {
          id: "1",
          coupon_id: "24",
          percent: "20",
          max: "500",
          type: "1",
          start: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          end: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        },
      ];
    },

    editItem(item) {
      this.editedIndex = this.coupons.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.coupons.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.coupons.splice(this.editedIndex, 1);
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
        Object.assign(this.coupons[this.editedIndex], this.editedItem);
      } else {
        this.coupons.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style scoped>
</style>