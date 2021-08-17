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
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItem.question"
                      label="پرسش"
                      :error-messages="questionErrors"
                      :counter="32"
                      required
                      @input="$v.editedItem.question.$touch()"
                      @blur="$v.editedItem.question.$touch()"
                      v-model:trim="$v.editedItem.question.$model"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <label>پاسخ</label>
                    <ckeditor v-model="editedItem.answer" v-bind:config="ckConfig"/>
                    <!--<v-text-field v-model="editedItem.answer"-->
                    <!--label="خلاصه پاسخ" v-bind:items="selectOptions">-->

                    <!--&gt;-->
                    <!--</v-text-field>-->
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
    mixins: [validationMixin],

    validations: {
      editedItem: {
        question: {required},
      }
    },
    components: {
      DeleteDialog,
      ActionIcon,
      ckeditor: process.browser ? CKEditor.component : null,
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

        {text: "تنظیمات", value: "actions", sortable: false},
      ],
      faqs: [],
      editedIndex: -1,
      editedItem: {
        question: "",
        answer: "",

      },
      defaultItem: {
        question: "",
      },
    }),

    computed: {
      questionErrors() {
        const errors = []
        if (!this.$v.editedItem.question.$dirty) return errors;

        !this.$v.editedItem.question.required && errors.push(' پرسش الزامی است');
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
        this.faqs = [
          {
            id: "1",
            question: "Iphone",
            answer: "الکترونیکی",
          },
        ];
      },

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
        this.faqs.splice(this.editedIndex, 1);
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
          Object.assign(this.faqs[this.editedIndex], this.editedItem);
        } else {
          this.faqs.push(this.editedItem);
        }
        this.close();
      },
    },
  };
</script>

<style scoped>
</style>
