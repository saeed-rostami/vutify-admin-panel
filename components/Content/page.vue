<template>
  <v-data-table
    :headers="headers"
    :items="pages"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title> پیج ساز</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="1200">
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
                      v-model="editedItem.address"
                      label="آدرس صفحه"
                      :error-messages="addressErrors"
                      required
                      @input="$v.editedItem.address.$touch()"
                      @blur="$v.editedItem.address.$touch()"
                      v-model:trim="$v.editedItem.address.$model"

                    >

                      >
                    </v-text-field>
                  </v-col>

                  <v-col cols="12">

                    <label>محتوا</label>
                    <ckeditor v-model="editedItem.description" v-bind:config="ckConfig"/>
                    <!--<v-textarea-->
                    <!--v-model="editedItem.description"-->
                    <!--label="توضیحات"-->
                    <!--auto-grow-->
                    <!--outlined-->
                    <!--rows="3"-->
                    <!--row-height="25"-->
                    <!--shaped-->
                    <!--&gt;</v-textarea>-->
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
  import ActionIcon from "../CustomComponent/ActionIcon";
  import DeleteDialog from "../CustomComponent/DeleteDialog";

  let CKEditor;
  if (process.browser) {
    CKEditor = require("ckeditor4-vue")
  }
  export default {
    components: {
      DeleteDialog,
      ActionIcon,
      ckeditor: process.browser ? CKEditor.component : null,
    },

    mixins: [validationMixin],

    validations: {
      editedItem: {
        name: {required},
        address: {required},
      }
    },
    data: () => ({
      ckConfig: {
        language: 'fa',
      },
      selectOptions: ['Foo', 'Bar', 'Fizz', 'Buzz'],
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: "نام", value: "name"},
        {text: "آدرس صفحه", value: "address"},

        {text: "تنظیمات", value: "actions", sortable: false},
      ],
      pages: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        address: "",
        description: "",

      },
      defaultItem: {
        name: "",
        address: "",
        description: "",

      },
    }),

    computed: {
      nameErrors() {
        const errors = [];
        if (!this.$v.editedItem.name.$dirty) return errors;

        !this.$v.editedItem.name.required && errors.push('نام الزامی است');
        return errors
      },

      addressErrors() {
        const errors = [];
        if (!this.$v.editedItem.address.$dirty) return errors;

        !this.$v.editedItem.address.required && errors.push('آدرس صفحه الزامی است');
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
        this.pages = [
          {
            id: "1",
            name: "Iphone",
            address: "الکترونیکی",
          },
        ];
      },

      editItem(item) {
        this.editedIndex = this.pages.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        this.editedIndex = this.pages.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        this.pages.splice(this.editedIndex, 1);
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
          Object.assign(this.pages[this.editedIndex], this.editedItem);
        } else {
          this.pages.push(this.editedItem);
        }
        this.close();
      },
    },
  };
</script>

<style scoped>
</style>
