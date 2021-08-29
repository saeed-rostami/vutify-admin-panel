<template>
  <v-data-table
    :headers="headers"
    :items="pages"
    sort-by="question"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>پیج ها</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="1200">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on">
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
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="editedItem.title"
                      :error-messages="titleErrors"
                      :counter="32"
                      label="نام"
                      required
                      @input="$v.editedItem.title.$touch()"
                      @blur="$v.editedItem.title.$touch()"
                      v-model:trim="$v.editedItem.title.$model"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-select
                      v-model="editedItem.status"
                      v-bind:label="statusLabel"
                      :error-messages="statusErrors"
                      required
                      @change="$v.editedItem.status.$touch()"
                      @blur="$v.editedItem.status.$touch"
                      v-bind:items="statusOptions"
                      v-model:trim="$v.editedItem.status.$model"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <label>پاسخ</label>
                    <ckeditor v-model="editedItem.body" v-bind:config="ckConfig"/>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                  >
                    <client-only>
                      <Select2
                        class="style-chooser"
                        multiple
                        taggable
                        v-model="editedItem.tags"
                        label="name"
                        placeholder="برچسب ها..."
                      />
                    </client-only>
                  </v-col>


                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled='isDisabled'
                color="success"
                text
                @click="clearValidation"
              >
                پاک کردن خطاها
              </v-btn>
              <v-btn color="blue darken-1" text @click="close"> لغو</v-btn>
              <v-btn color="blue darken-1" text @click="submitForm"> ایجاد</v-btn>
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
      <h1 class="font-weight-bold">هیچ محتوایی وجود ندارد</h1>
    </template>


  </v-data-table>


</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import ActionIcon from "../CustomComponent/ActionIcon";
  import DeleteDialog from "../CustomComponent/DeleteDialog";
  import Base from "@/mixins/Base";
  import ValidationErrors from "@/mixins/ValidationErrors";
  import Crud from "@/mixins/Crud";

  let CKEditor;
  if (process.browser) {
    CKEditor = require("ckeditor4-vue")
  }
  export default {
    mixins: [validationMixin, Base, ValidationErrors],

    validations: {
      editedItem: {
        title: {required},
        status: {required},
      }
    },
    components: {
      DeleteDialog,
      ActionIcon,
      ckeditor: process.browser ? CKEditor.component : null,
    },
    props: {
      pages: {
        type: Array,
        required: false
      }
    },
    data: () => ({
      ckConfig: {
        language: 'fa',
      },

      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: "نام", value: "title"},
        {text: "خلاصه پاسخ", value: "body"},
        {text: 'وضعیت', value: 'status_text'},

        {text: "تنظیمات", value: "actions", sortable: false},
      ],
      editedIndex: -1,
      editedItem: {
        title: "",
        body: "",
        status: "",
        status_text: "",
        tags: [],

      },
      defaultItem: {
        title: "",
        body: "",
        status: "",
        status_text: "",
        tags: [],

      },
    }),

    computed: {
      // statusLabel() {
      //   return this.editedItem.status_text ? this.editedItem.status_text : 'وضعیت';
      // },
    },

    methods: {

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
        let path = 'content/page/';
        Crud.delete(this.editedItem.id, this.$axios, path);
        this.closeDelete();
        let self = this;
        setTimeout(() => {
          self.$store.dispatch('Content/page/getAllPages');
        }, 2000);
      },

      save() {
        this.clearValidation();
        let formData = new FormData();
        formData.append('title', this.editedItem.title);
        formData.append('body', this.editedItem.body);
        formData.append('status', this.editedItem.status);
        formData.append('tags', this.editedItem.tags);
        console.log(...formData);
        if (this.editedIndex > -1) {
          formData.append('_method', 'PUT');
          let path = 'content/page/';
          Crud.update(formData, this.$axios, path, this.editedItem.id);
          this.close();
          let self = this;
          setTimeout(() => {
            self.$store.dispatch('Content/page/getAllPages');
          }, 2000);
        } else {
          let path = 'content/page/';
          Crud.store(formData, this.$axios, path);
          this.close();
          let self = this;
          setTimeout(() => {
            self.$store.dispatch('Content/page/getAllPages');
          }, 2000);
        }
        this.close();
      },
    },
  };
</script>

<style scoped>
</style>
