<template>
  <section>

    <v-data-table
      :headers="headers"
      :items="categories"
      sort-by="name"
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
          <v-toolbar-title>دسته بندی</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
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
                      sm="12"
                      md="12"
                    >
                      <v-textarea
                        v-model="editedItem.description"
                        :error-messages="descriptionErrors"
                        label="توضیحات"
                        required
                        auto-grow
                        outlined
                        rows="3"
                        row-height="25"
                        shaped
                        @input="$v.editedItem.description.$touch()"
                        @blur="$v.editedItem.description.$touch()"
                        v-model:trim="$v.editedItem.description.$model"
                      ></v-textarea>
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
                  color="success"
                  text
                  @click="close"
                >
                  لغو
                </v-btn>

                <v-btn
                  color="success"
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
  import {mapState} from 'vuex'


  export default {
    components: {DeleteDialog, ActionIcon},
    mixins: [validationMixin, Base, ValidationErrors],

    props: {
      categories: {
        type: Array,
        required: true
      }
    },

    validations: {
      editedItem: {
        name: {required},
        description: {required},
        status: {required},
        image: {required},
      }
    },

    data: () => ({
      imageFile: null,
      statusOptions: [
        'فعال',
        'غیر فعال'
      ],
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: 'نام', value: 'name'},
        {text: 'توضیحات', value: 'description'},
        {text: 'وضعیت', value: 'status_text'},
        {text: 'تصویر', value: 'image'},
        {text: 'تنظیمات', value: 'actions', sortable: false},
      ],
      editedIndex: -1,
      editedItem: {
        name: '',
        description: '',
        status: '',
        status_text: '',
        image: [],
        tags: [],

      },
      defaultItem: {
        name: '',
        description: '',
        status: '',
        status_text: '',
        image: [],
        tags: [],
      },
    }),

    computed: {
      ...mapState('Content/category', ['imgURL']),
      statusLabel() {
        return this.editedItem.status_text ? this.editedItem.status_text : 'وضعیت';
      },
    },


    methods: {
      selectedImage() {
        this.imageFile = document.getElementById('file').files[0];
      },

      editItem(item) {
        this.editedIndex = this.categories.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true
      },

      deleteItem(item) {
        this.editedIndex = this.categories.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true

      },
      deleteItemConfirm() {
        let path = 'content/category/';
        Crud.delete(this.editedItem.id, this.$axios, path);
        this.closeDelete();
        this.$store.dispatch('Content/category/getAllPostCategories');
      },

      save() {
        this.clearValidation();
        let formData = new FormData();
        formData.append('image', this.imageFile);
        formData.append('name', this.editedItem.name);
        formData.append('description', this.editedItem.description);
        formData.append('status', this.editedItem.status);
        formData.append('tags', this.editedItem.tags);

        if (this.editedIndex > -1) {
          formData.append('_method', 'PUT');
          let path = 'content/category/';
          Crud.update(formData, this.$axios, path, this.editedItem.id);
          this.close();
          this.$store.dispatch('Content/category/getAllPostCategories');

        } else {
          let path = 'content/category/';
          Crud.store(formData, this.$axios, path);
          this.close();
          this.$store.dispatch('Content/category/getAllPostCategories');
        }
        this.close()
      }

    },
  }
</script>

<style scoped>

</style>
