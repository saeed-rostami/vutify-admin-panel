<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-data-table
    :headers="headers"
    :items="brands"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:item.logo="{item}">
      <v-avatar
      >
        <img :src="item.logo" alt="alt">
      </v-avatar>
    </template>

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>برند ها</v-toolbar-title>
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
                    <v-file-input
                      v-model="editedItem.logo"
                      :error-messages="imageErrors"
                      label="لوگو"
                      required
                      @input="$v.editedItem.logo.$touch()"
                      @blur="$v.editedItem.logo.$touch()"
                      v-model:trim="$v.editedItem.logo.$model"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="6" md="4"></v-col>
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
    components: {DeleteDialog, ActionIcon},
    mixins: [validationMixin],

    validations: {
      editedItem: {
        name: {required},
        logo: {required},
      }
    },

    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: "نام", value: "name"},
        {text: "لوگو", value: "logo"},
        {text: "تنظیمات", value: "actions", sortable: false},
      ],
      brands: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        logo: [],
      },
      defaultItem: {
        name: "",
        logo: [],
      },
    }),

    computed: {
      nameErrors() {
        const errors = [];
        if (!this.$v.editedItem.name.$dirty) return errors;

        !this.$v.editedItem.name.required && errors.push('نام دسته بندی الزامی است');
        return errors
      },

      imageErrors() {
        const errors = [];
        if (!this.$v.editedItem.logo.$dirty) return errors;

        !this.$v.editedItem.logo.required && errors.push('تصویر دسته بندی الزامی است');
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
        this.brands = [
          {
            id: "1",
            name: "Iphone",
            logo: "https://cdn.vuetifyjs.com/images/john.jpg",
          },

          {
            id: "2",
            name: "samsung",
            logo: require("@/static/avatar/man_4.jpg"),
          },
        ];
      },

      editItem(item) {
        console.log('edit', item);

        this.editedIndex = this.brands.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        console.log('delete', item);

        this.editedIndex = this.brands.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        this.brands.splice(this.editedIndex, 1);
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
          Object.assign(this.brands[this.editedIndex], this.editedItem);
        } else {
          this.brands.push(this.editedItem);
        }
        this.close();
      },
    },
  };
</script>

<style scoped>
</style>
