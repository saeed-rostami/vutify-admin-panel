<template>
  <v-data-table
    :headers="headers"
    :items="deliveries"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>روش های ارسال</v-toolbar-title>
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
                      v-model="editedItem.name"
                      :error-messages="nameErrors"
                      :counter="32"
                      label="نام"
                      required
                      @input="$v.editedItem.name.$touch()"
                      @blur="$v.editedItem.name.$touch()"
                      v-model:trim="$v.editedItem.name.$model"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.price"
                      label="هزینه ارسال"

                      :error-messages="priceErrors"
                      required
                      @input="$v.editedItem.price.$touch()"
                      @blur="$v.editedItem.price.$touch()"
                      v-model:trim="$v.editedItem.price.$model"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.time"
                      label="زمان ارسال"

                      :error-messages="timeErrors"
                      required
                      @input="$v.editedItem.time.$touch()"
                      @blur="$v.editedItem.time.$touch()"
                      v-model:trim="$v.editedItem.time.$model"
                    ></v-text-field>
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
  import ActionIcon from "../../AppBarComponents/ActionIcon";

  export default {
    components: {ActionIcon},
    mixins: [validationMixin],

    validations: {
      editedItem: {
        name: {required},
        price: {required},
        time: {required},
      }
    },
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: "نام", value: "name"},
        {text: "هزینه", value: "price"},
        {text: " زمان ارسال", value: "time"},
        {text: "تنظیمات", value: "actions", sortable: false},
      ],
      deliveries: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        price: "",
        time: "",
      },
      defaultItem: {
        name: "",
        price: "",
        time: "",
      },
    }),

    computed: {
      nameErrors() {
        const errors = [];
        if (!this.$v.editedItem.name.$dirty) return errors;

        !this.$v.editedItem.name.required && errors.push('نام دسته بندی الزامی است');
        return errors
      },

      priceErrors() {
        const errors = [];
        if (!this.$v.editedItem.price.$dirty) return errors;

        !this.$v.editedItem.price.required && errors.push('هزینه ارسال الزامی است');
        return errors
      },

      timeErrors() {
        const errors = [];
        if (!this.$v.editedItem.time.$dirty) return errors;

        !this.$v.editedItem.time.required && errors.push('زمان ارسال الزامی است');
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
        this.deliveries = [
          {
            id: "1",
            name: "پست پیشتاز",
            price: "20000",
            time: "2 روز",
          },
        ];
      },

      editItem(item) {
        this.editedIndex = this.deliveries.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        this.editedIndex = this.deliveries.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        this.deliveries.splice(this.editedIndex, 1);
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
          Object.assign(this.deliveries[this.editedIndex], this.editedItem);
        } else {
          this.deliveries.push(this.editedItem);
        }
        this.close();
      },
    },
  };
</script>

<style scoped>
</style>
