<template>
  <section>

    <v-data-table
      :headers="headers"
      :items="posts"
      sort-by="title"
      class="elevation-1"
    >

      <template v-slot:item.image="{item}">
        <v-avatar
        >
          <img :src="imgURL+item.image" alt="alt">
        </v-avatar>
      </template>

      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>پست ها</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="1200"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="success"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
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
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
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
                        v-model="editedItem.category_id"
                        :error-messages="categoryErrors"
                        v-bind:label="categoryLabel"
                        required
                        v-bind:items="postCategories"
                        @change="$v.editedItem.category_id.$touch()"
                        @blur="$v.editedItem.category_id.$touch"
                        v-model:trim="$v.editedItem.category_id.$model"

                      >

                      </v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-file-input
                        v-on:change="selectedImage"
                        id="file"
                        type="file"
                        v-model="editedItem.image"
                        :error-messages="imageErrors"
                        label="تصویر"
                        required
                        @input="$v.editedItem.image.$touch()"
                        @blur="$v.editedItem.image.$touch()"
                        v-model:trim="$v.editedItem.image.$model"
                      ></v-file-input>
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

                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-select
                        v-model="editedItem.commentable"
                        v-bind:label="commentableLabel"
                        :error-messages="commentableErrors"
                        required
                        @change="$v.editedItem.commentable.$touch()"
                        @blur="$v.editedItem.commentable.$touch"
                        v-bind:items="commentableOptions"
                        v-model:trim="$v.editedItem.commentable.$model"
                      >
                      </v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <client-only>
                        <label>تاریخ انتشار</label>
                        <PersianDatePicker v-model="editedItem.published"/>
                      </client-only>
                    </v-col>


                    <v-col
                      cols="12"
                      sm="12"
                      md="12"
                    >
                      <v-textarea
                        v-model="editedItem.summary"
                        :error-messages="summaryErrors"
                        label="خلاصه"
                        required
                        auto-grow
                        outlined
                        rows="3"
                        row-height="25"
                        shaped
                        @input="$v.editedItem.summary.$touch()"
                        @blur="$v.editedItem.summary.$touch()"
                        v-model:trim="$v.editedItem.summary.$model"
                      ></v-textarea>
                    </v-col>

                    <v-col cols="12">
                      <label>توضیحات</label>
                      <ckeditor
                        v-model="editedItem.body"
                        v-bind:config="ckConfig"/>

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
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  لغو
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="submitForm"
                >
                  ایجاد
                </v-btn>
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
  </section>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import ActionIcon from "../CustomComponent/ActionIcon";
  import DeleteDialog from "../CustomComponent/DeleteDialog";
  import Base from "@/mixins/Base";
  import ValidationErrors from "@/mixins/ValidationErrors";
  import Crud from "@/mixins/Crud";
  import {mapState} from "vuex";


  let CKEditor;
  if (process.browser) {
    CKEditor = require("ckeditor4-vue")
  }

  export default {
    mixins: [validationMixin, Base, ValidationErrors],


    validations: {
      editedItem: {
        title: {required},
        category_id: {required},
        image: {required},
        status: {required},
        commentable: {required},
        body: {required},
        summary: {required},
      }
    },
    components: {
      DeleteDialog,
      ActionIcon,
      PersianDatePicker: () => import('vue-persian-datetime-picker'),
      ckeditor: process.browser ? CKEditor.component : null,

    },
    props: {
      categories: {
        type: Array,
        required: false,
      },
      posts: {
        type: Array,
        required: false
      }
    },


    data: () => ({
      postCategoriesID: [],
      postCategories: [],
      imageFile: null,
      ckConfig: {
        language: 'fa',
      },
      publishedDatePicker: false,
      statusOptions: [
        'فعال',
        'غیر فعال'
      ],
      commentableOptions: ['فعال',
        'غیر فعال'],
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: 'نام', value: 'title'},
        {text: 'دسته بندی', value: 'category_text'},
        {text: 'تصویر', value: 'image'},
        {text: 'وضعیت', value: 'status_text'},
        {text: 'اجازه نظر دهی', value: 'commentable_text'},
        {text: 'زمان انتشار', value: 'published_text'},
        {text: 'تنظیمات', value: 'actions', sortable: false},
      ],
      editedIndex: -1,
      editedItem: {
        title: '',
        category_id: '',
        image: [],
        body: '',
        published: '',
        published_text: '',
        status: '',
        status_text: '',
        category_text: '',
        commentable_text: '',
        commentable: '',
        summary: '',
        tags: [],

      },
      defaultItem: {
        title: '',
        category_id: '',
        image: [],
        body: '',
        published: '',
        published_text: '',
        status: '',
        status_text: '',
        category_text: '',
        commentable: '',
        commentable_text: '',
        summary: '',
        tags: [],

      },
    }),

    mounted() {
      this.postCategories = this.categories.map(({name}) => name);
      // console.log(this.postCategories);
    },

    computed: {
      ...mapState('Content/post', ['imgURL']),

      categoryLabel() {
        return this.editedItem.category_text ? this.editedItem.category_text : 'دسته بندی';
      },

      commentableLabel() {
        return this.editedItem.commentable_text ? this.editedItem.commentable_text : 'وضعیت ارسال دیدگاه';
      },
    },

    methods: {
      selectedImage() {
        this.imageFile = document.getElementById('file').files[0];
      },

      editItem(item) {
        this.editedIndex = this.posts.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true
      },

      deleteItem(item) {
        this.editedIndex = this.posts.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true
      },

      deleteItemConfirm() {
        let path = 'content/post/';
        Crud.delete(this.editedItem.id, this.$axios, path);
        this.closeDelete();
        let self = this;
        setTimeout(() => {
          self.$store.dispatch('Content/post/getAllPosts');
        }, 2000);
      },

      save() {
        this.clearValidation();
        let formData = new FormData();
        formData.append('image', this.imageFile);
        formData.append('title', this.editedItem.title);
        formData.append('category_id', this.editedItem.category_id);
        formData.append('body', this.editedItem.body);
        formData.append('status', this.editedItem.status);
        formData.append('commentable', this.editedItem.commentable);
        formData.append('summary', this.editedItem.summary);
        formData.append('published_at', this.editedItem.published);
        formData.append('tags', this.editedItem.tags);

        console.log(...formData);
        if (this.editedIndex > -1) {
          formData.append('_method', 'PUT');
          let path = 'content/post/';
          Crud.update(formData, this.$axios, path, this.editedItem.id);
          this.close();
          let self = this;
          setTimeout(() => {
            self.$store.dispatch('Content/post/getAllPosts');
          }, 2000);
          this.imageFile = null;
        } else {
          let path = 'content/post/';
          Crud.store(formData, this.$axios, path);
          this.close();
          let self = this;
          setTimeout(() => {
            self.$store.dispatch('Content/post/getAllPosts');
          }, 2000);
          this.imageFile = null;
        }
        this.close()
      },
    },
  }
</script>

<style scoped>

</style>
