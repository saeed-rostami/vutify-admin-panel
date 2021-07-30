<template>
  <v-data-table
    :headers="headers"
    :items="generals"
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
        <v-toolbar-title>تخفیف عمومی </v-toolbar-title>
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
                      v-model="editedItem.occasion"
                      label="عنوان مناسبت"
                    ></v-text-field>
                  </v-col>



<!-- START -->

                  <!--<v-col cols="12" sm="6" md="4">-->
                    <!--<v-menu-->
                      <!--v-model="startDatePicker"-->
                      <!--:close-on-content-click="false"-->
                      <!--:nudge-right="40"-->
                      <!--transition="scale-transition"-->
                      <!--offset-y-->
                      <!--min-width="auto"-->
                    <!--&gt;-->
                      <!--<template v-slot:activator="{ on, attrs }">-->
                        <!--<v-text-field-->
                          <!--v-model="editedItem.start"-->
                          <!--label="تاریخ شروع"-->
                          <!--prepend-icon="mdi-calendar"-->
                          <!--readonly-->
                          <!--v-bind="attrs"-->
                          <!--v-on="on"-->
                        <!--&gt;</v-text-field>-->
                      <!--</template>-->
                      <!--<v-date-picker-->
                        <!--v-model="editedItem.start"-->
                        <!--@input="startDatePicker = false"-->
                      <!--&gt;</v-date-picker>-->
                    <!--</v-menu>-->
                  <!--</v-col>-->
                  <v-col cols="12" sm="6" md="6">
                    <client-only>
                      <label>تاریخ شروع</label>
                      <PersianDatePicker v-model="editedItem.start"/>
                    </client-only>
                  </v-col>
                  <!-- EDN -->
                   <!--<v-col cols="12" sm="6" md="4">-->
                    <!--<v-menu-->
                      <!--v-model="endDatePicker"-->
                      <!--:close-on-content-click="false"-->
                      <!--:nudge-right="40"-->
                      <!--transition="scale-transition"-->
                      <!--offset-y-->
                      <!--min-width="auto"-->
                    <!--&gt;-->
                      <!--<template v-slot:activator="{ on, attrs }">-->
                        <!--<v-text-field-->
                          <!--v-model="editedItem.end"-->
                          <!--label="تاریخ پایان"-->
                          <!--prepend-icon="mdi-calendar"-->
                          <!--readonly-->
                          <!--v-bind="attrs"-->
                          <!--v-on="on"-->
                        <!--&gt;</v-text-field>-->
                      <!--</template>-->
                      <!--<v-date-picker-->
                        <!--v-model="editedItem.end"-->
                        <!--@input="endDatePicker = false"-->
                      <!--&gt;</v-date-picker>-->
                    <!--</v-menu>-->
                  <!--</v-col>-->
                  <v-col cols="12" sm="6" md="6">
                    <client-only>
                      <label>تاریخ پایان</label>
                      <PersianDatePicker v-model="editedItem.end"/>
                    </client-only>
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
  components: {
    PersianDatePicker: () => import('vue-persian-datetime-picker'),
  },
  data: () => ({
    startDatePicker: false,
    endDatePicker: false,
    selectOptions: ["Foo", "Bar", "Fizz", "Buzz"],
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "#", value: "id" },
      { text: "درصد تخفیف", value: "percent" },
      { text: "سقف تخفیف", value: "max" },
      { text: "عنوان مناسبت", value: "occasion" },
      { text: "تاریخ شروع", value: "start" },
      { text: "تاریخ پایان", value: "end" },

      { text: "تنظیمات", value: "actions", sortable: false },
    ],
    generals: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      percent: "",
      max: "",
      occasion: "",
      start: "",
      end: "",
    },
    defaultItem: {
      id: "",
      percent: "",
      max: "",
      occasion: "",
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
      this.generals = [
        {
          id: "1",
          percent: "20",
          max: "500",
          occasion: "1",
          start: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          end: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        },
      ];
    },

    editItem(item) {
      this.editedIndex = this.generals.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.generals.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.generals.splice(this.editedIndex, 1);
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
        Object.assign(this.generals[this.editedIndex], this.editedItem);
      } else {
        this.generals.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style scoped>
</style>
