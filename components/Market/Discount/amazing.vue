<template>
  <v-data-table
    :headers="headers"
    :items="amazings"
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
        <v-toolbar-title>فروش شگفت انگیز</v-toolbar-title>
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

                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.percent"
                      label="درصد تخفیف"

                      :error-messages="percentErrors"
                      required
                      @input="$v.editedItem.percent.$touch()"
                      @blur="$v.editedItem.percent.$touch()"
                      v-model:trim="$v.editedItem.percent.$model"
                    ></v-text-field>
                  </v-col>


                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.product"
                      label="نام کالا"

                      :error-messages="productErrors"
                      required
                      @input="$v.editedItem.product.$touch()"
                      @blur="$v.editedItem.product.$touch()"
                      v-model:trim="$v.editedItem.product.$model"
                    ></v-text-field>
                  </v-col>


                  <!-- START -->
                  <v-col cols="12" sm="6" md="6">
                    <client-only>
                      <label>تاریخ شروع</label>
                      <PersianDatePicker v-model="editedItem.start"
                                         :error-messages="startErrors"
                                         required
                                         @input="$v.editedItem.start.$touch()"
                                         @blur="$v.editedItem.start.$touch()"
                                         v-model:trim="$v.editedItem.start.$model"

                      />
                    </client-only>
                  </v-col>
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
                      <PersianDatePicker v-model="editedItem.end"
                                         :error-messages="endErrors"
                                         required
                                         @input="$v.editedItem.end.$touch()"
                                         @blur="$v.editedItem.end.$touch()"
                                         v-model:trim="$v.editedItem.end.$model"

                      />
                    </client-only>
                  </v-col>

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
      <ActionIcon
        v-bind:icon="` mdi-eye`"
        v-bind:tooltip="`نمایش`"
        v-bind:item="item"
        v-on:click="showComment(item)"
      />

      <ActionIcon
        v-bind:icon="`mdi-check-outline`"
        v-bind:tooltip="`تایید`"
        v-bind:item="item"
        v-on:click="confirmComment(item)"
      />
    </template>

    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import ActionIcon from "../../AppBarComponents/ActionIcon";

  export default {
    mixins: [validationMixin],
    components: {
      ActionIcon,
      PersianDatePicker: () => import('vue-persian-datetime-picker'),
    },

    validations: {
      editedItem: {
        percent: {required},
        product: {required},
        start: {required},
        end: {required},
      }
    },
    data: () => ({
      startDatePicker: false,
      endDatePicker: false,
      selectOptions: ["Foo", "Bar", "Fizz", "Buzz"],
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: "درصد تخفیف", value: "percent"},
        {text: "نام کالا", value: "product"},
        {text: "تاریخ شروع", value: "start"},
        {text: "تاریخ پایان", value: "end"},

        {text: "تنظیمات", value: "actions", sortable: false},
      ],
      amazings: [],
      editedIndex: -1,
      editedItem: {
        id: "",
        percent: "",
        product: "",
        start: "",
        end: "",
      },
      defaultItem: {
        id: "",
        percent: "",
        product: "",
        start: "",
        end: "",
      },
    }),

    computed: {

      productErrors() {
        const errors = [];
        if (!this.$v.editedItem.product.$dirty) return errors;

        !this.$v.editedItem.product.required && errors.push('نام کالا الزامی است');
        return errors
      },

      percentErrors() {
        const errors = [];
        if (!this.$v.editedItem.percent.$dirty) return errors;

        !this.$v.editedItem.percent.required && errors.push('درصد تخفیف الزامی است');
        return errors
      },

      startErrors() {
        const errors = [];
        if (!this.$v.editedItem.start.$dirty) return errors;

        !this.$v.editedItem.start.required && errors.push('تاریخ شروع الزامی است');
        return errors
      },
      endErrors() {
        const errors = [];
        if (!this.$v.editedItem.end.$dirty) return errors;

        !this.$v.editedItem.end.required && errors.push('تاریخ پایان الزامی است');
        return errors
      },
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
        this.amazings = [
          {
            id: "1",
            percent: "20",
            product: "apple",
            start: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            end: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          },
        ];
      },

      editItem(item) {
        this.editedIndex = this.amazings.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        this.editedIndex = this.amazings.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        this.amazings.splice(this.editedIndex, 1);
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
          Object.assign(this.amazings[this.editedIndex], this.editedItem);
        } else {
          this.amazings.push(this.editedItem);
        }
        this.close();
      },
    },
  };
</script>

<style scoped>
</style>
