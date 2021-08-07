<template>
  <v-data-table
    :headers="headers"
    :items="categories"
    sort-by="name"
    class="elevation-1"
  >
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
                      v-model="editedItem.category"
                      label="دسته بندی"
                      :error-messages="categoryErrors"
                      required
                      @change="$v.editedItem.category.$touch()"
                      @blur="$v.editedItem.category.$touch"
                      v-bind:items="selectOptions"
                      v-model:trim="$v.editedItem.category.$model"
                    >


                    </v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >

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
        @click="initialize"
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

    validations: {
      editedItem: {
        name: {required},
        category: {required},
      }
    },
    data: () => ({
      selectOptions: ['Foo', 'Bar', 'Fizz', 'Buzz'],

      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: 'نام', value: 'name'},
        {text: 'دسته بندی', value: 'category'},
        {text: 'تنظیمات', value: 'actions', sortable: false},
      ],
      categories: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        category: '',

      },
      defaultItem: {
        name: '',
        category: '',

      },
    }),

    computed: {
      nameErrors() {
        const errors = [];
        if (!this.$v.editedItem.name.$dirty) return errors;

        !this.$v.editedItem.name.required && errors.push('نام دسته بندی الزامی است');
        return errors
      },

      categoryErrors() {
        const errors = []
        if (!this.$v.editedItem.category.$dirty) return errors;

        !this.$v.editedItem.category.required && errors.push(' دسته بندی الزامی است');
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

    created() {
      this.initialize()
    },

    methods: {
      initialize() {
        this.categories = [
          {
            id: "1",
            name: 'Iphone',
            category: 'الکترونیکی'
          },
        ]
      },

      editItem(item) {
        this.editedIndex = this.categories.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem(item) {
        this.editedIndex = this.categories.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm() {
        this.categories.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save() {
        if (this.editedIndex > -1) {
          Object.assign(this.categories[this.editedIndex], this.editedItem)
        } else {
          this.categories.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>

<style scoped>

</style>
