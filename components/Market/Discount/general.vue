<template>
  <v-data-table
    :headers="headers"
    :items="generals"
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
        <v-toolbar-title>تخفیف عمومی</v-toolbar-title>
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

                      :error-messages="percentErrors"
                      required
                      @input="$v.editedItem.percent.$touch()"
                      @blur="$v.editedItem.percent.$touch()"
                      v-model:trim="$v.editedItem.percent.$model"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.max"
                      label="سقف تخفیف"

                      :error-messages="maxErrors"
                      required
                      @input="$v.editedItem.max.$touch()"
                      @blur="$v.editedItem.max.$touch()"
                      v-model:trim="$v.editedItem.max.$model"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.occasion"
                      label="عنوان مناسبت"

                      :error-messages="occasionErrors"
                      required
                      @input="$v.editedItem.occasion.$touch()"
                      @blur="$v.editedItem.occasion.$touch()"
                      v-model:trim="$v.editedItem.occasion.$model"
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
                      <PersianDatePicker v-model="editedItem.start"
                                         :error-messages="startErrors"
                                         required
                                         @input="$v.editedItem.start.$touch()"
                                         @blur="$v.editedItem.start.$touch()"
                                         v-model:trim="$v.editedItem.start.$model"
                      />
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
                      <PersianDatePicker
                        v-model="editedItem.end"

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
        <DeleteDialog
          v-bind:dialogDelete="dialogDelete"
          v-on:deleteItemConfirm="deleteItemConfirm"
          v-on:closeDelete="closeDelete"
        />

      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <ActionIcon
        v-bind:icon="`mdi-pencil`"
        v-bind:tooltip="`ویرایش`"
        v-bind:item="item"
        v-on:click="editItem(item)"
      />

      <ActionIcon
        v-bind:icon="`mdi-delete`"
        v-bind:tooltip="`حذف`"
        v-bind:item="item"
        v-on:click="deleteItem(item)"
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
  import ActionIcon from "../../CustomComponent/ActionIcon";
  import DeleteDialog from "../../CustomComponent/DeleteDialog";

  export default {
    components: {
      DeleteDialog,
      ActionIcon,
      PersianDatePicker: () => import('vue-persian-datetime-picker'),
    },
    mixins: [validationMixin],


    validations: {
      editedItem: {
        percent: {required},
        max: {required},
        occasion: {required},
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
        {text: "سقف تخفیف", value: "max"},
        {text: "عنوان مناسبت", value: "occasion"},
        {text: "تاریخ شروع", value: "start"},
        {text: "تاریخ پایان", value: "end"},

        {text: "تنظیمات", value: "actions", sortable: false},
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
      percentErrors() {
        const errors = [];
        if (!this.$v.editedItem.percent.$dirty) return errors;

        !this.$v.editedItem.percent.required && errors.push('درصد کوپن الزامی است');
        return errors
      },

      maxErrors() {
        const errors = [];
        if (!this.$v.editedItem.max.$dirty) return errors;

        !this.$v.editedItem.max.required && errors.push('سقف کوپن الزامی است');
        return errors
      },

      occasionErrors() {
        const errors = [];
        if (!this.$v.editedItem.occasion.$dirty) return errors;

        !this.$v.editedItem.occasion.required && errors.push('عنوان مناسبت کوپن الزامی است');
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
