<template>
  <v-data-table
    :headers="headers"
    :items="categories"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:item.image="{item}">
      <v-avatar
      >
        <img :src="`http://localhost:8000/storage/images/${item.image}`" alt="alt">
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
              color="primary"
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
                      label="وضعیت"
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
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
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
                @click="save"
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
      <v-btn
        color="primary"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import ActionIcon from "../CustomComponent/ActionIcon";
  import DeleteDialog from "../CustomComponent/DeleteDialog";

  export default {
    components: {DeleteDialog, ActionIcon},
    mixins: [validationMixin],

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
      statusOptions: ['Active', 'DeActive'],

      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: 'نام', value: 'name'},
        {text: 'توشیحات', value: 'description'},
        {text: 'وضعیت', value: 'status'},
        {text: 'تصویر', value: 'image'},
        {text: 'تنظیمات', value: 'actions', sortable: false},
      ],
      // categories: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        description: '',
        status: '',
        image: [],

      },
      defaultItem: {
        name: '',
        description: '',
        status: '',
        image: [],
      },
    }),

    computed: {
      nameErrors() {
        const errors = [];
        if (!this.$v.editedItem.name.$dirty) return errors;


        !this.$v.editedItem.name.required && errors.push('نام دسته بندی الزامی است');
        return errors
      },

      descriptionErrors() {
        const errors = []
        if (!this.$v.editedItem.description.$dirty) return errors;

        !this.$v.editedItem.description.required && errors.push(' توضیحات الزامی است');
        return errors
      },

      imageErrors() {
        const errors = []
        if (!this.$v.editedItem.image.$dirty) return errors;

        !this.$v.editedItem.image.required && errors.push(' تصویر الزامی است');
        return errors
      },

      statusErrors() {
        const errors = []
        if (!this.$v.editedItem.status.$dirty) return errors;

        !this.$v.editedItem.status.required && errors.push(' وضعیت الزامی است');
        return errors
      },

      formTitle() {
        return this.editedIndex === -1 ? 'ایجاد' : 'ویرایش'
      },
    },

    watch: {
      dialog(val) {
        val || this.close()
      },
      dialogDelete(val) {
        val || this.closeDelete()
      },
    },
    // created() {
    //   this.initialize();
    // },

    methods: {

      selectedImage() {
        this.imageFile = document.getElementById('file').files[0];

      },
      // initialize() {
      //   this.categories = [
      //     {
      //       id: "1",
      //       name: 'خبری',
      //       description: 'اخبار روز',
      //       status: 'فعال',
      //       image: '',
      //     },
      //   ]
      // },

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
        this.$axios.$delete(`http://localhost:8000/admin/content/category/${this.editedItem.id}`, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response => {
          console.log(response.status);
          if (response.status === 200) {
            // TODO FETCH CATEGORIES FROM SERVE
          }
        })).catch((error) => {
          console.log(error)
        });
        this.closeDelete()
      },

      close() {
        this.dialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete() {
        this.dialogDelete = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save() {
        if (this.editedIndex > -1) {
          Object.assign(this.categories[this.editedIndex], this.editedItem)
        } else {
          const statusCode = this.editedItem.status === 'Active' ? '1' : '0';
          let formData = new FormData();
          formData.append('image', this.imageFile);
          formData.append('name', this.editedItem.name);
          formData.append('description', this.editedItem.description);
          formData.append('status', statusCode);

          console.log(...formData);
          this.$axios.$post('http://localhost:8000/admin/content/category', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then((response => {
            console.log(response.status);
            if (response.status === 200) {
              // TODO FETCH CATEGORIES FROM SERVE

            }


          })).catch((error) => {
            console.log(error)
          });
        }
        this.close()
      },
    },
  }
</script>

<style scoped>

</style>
