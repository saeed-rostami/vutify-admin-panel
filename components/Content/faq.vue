<template>
  <v-data-table
    :headers="headers"
    :items="faqs"
    sort-by="question"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>سوالات متداول</v-toolbar-title>
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
                  <v-col cols="12" sm="12" md="8">
                    <v-textarea
                      v-model="editedItem.question"
                      label="پرسش"
                      :error-messages="questionErrors"
                      auto-grow
                      outlined
                      rows="3"
                      row-height="25"
                      shaped
                      required
                      @input="$v.editedItem.question.$touch()"
                      @blur="$v.editedItem.question.$touch()"
                      v-model:trim="$v.editedItem.question.$model"
                    ></v-textarea>
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
                    <ckeditor v-model="editedItem.answer" v-bind:config="ckConfig"/>
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
      <v-btn color="primary" @click="initialize"> Reset</v-btn>
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
        question: {required},
        status: {required},
      }
    },
    components: {
      DeleteDialog,
      ActionIcon,
      ckeditor: process.browser ? CKEditor.component : null,
    },
    props: {
      faqs: {
        type: Array,
        required: false
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
        {text: "پرسش", value: "question"},
        {text: "خلاصه پاسخ", value: "answer"},
        {text: 'وضعیت', value: 'status_text'},

        {text: "تنظیمات", value: "actions", sortable: false},
      ],
      editedIndex: -1,
      editedItem: {
        question: "",
        answer: "",
        status: "",
        status_text: "",
        tags: [],

      },
      defaultItem: {
        question: "",
        answer: "",
        status: "",
        status_text: "",
        tags: [],

      },
    }),

    computed: {
      statusLabel() {
        return this.editedItem.status_text ? this.editedItem.status_text : 'وضعیت';
      },
    },

    methods: {

      editItem(item) {
        this.editedIndex = this.faqs.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        this.editedIndex = this.faqs.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        let path = 'content/faq/';
        Crud.delete(this.editedItem.id, this.$axios, path);
        this.closeDelete();
        let self = this;
        setTimeout(() => {
          self.$store.dispatch('Content/faq/getAllFaqs');
        }, 2000);
      },

      save() {
        this.clearValidation();
        let formData = new FormData();
        formData.append('question', this.editedItem.question);
        formData.append('answer', this.editedItem.answer);
        formData.append('status', this.editedItem.status);
        formData.append('tags', this.editedItem.tags);
        console.log(...formData);
        if (this.editedIndex > -1) {
          formData.append('_method', 'PUT');
          let path = 'content/faq/';
          Crud.update(formData, this.$axios, path, this.editedItem.id);
          this.close();
          let self = this;
          setTimeout(() => {
            self.$store.dispatch('Content/faq/getAllFaqs');
          }, 2000);
        } else {
          let path = 'content/faq/';
          Crud.store(formData, this.$axios, path);
          this.close();
          let self = this;
          setTimeout(() => {
            self.$store.dispatch('Content/faq/getAllFaqs');
          }, 2000);
        }
        this.close();
      },
    },
  };
</script>

<style scoped>
</style>
