<template>
  <v-data-table
    :headers="headers"
    :items="settings"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>تنظیمات</v-toolbar-title>
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
              class="mb-2 disabled"
              v-bind="attrs"
              v-on="on"
              disabled
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
                      label="نام"
                      :error-messages="nameErrors"
                      :counter="32"
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
                    <v-text-field
                      v-model="editedItem.value"
                      label="مقدار"

                      :error-messages="valueErrors"
                      :counter="32"
                      required
                      @input="$v.editedItem.value.$touch()"
                      @blur="$v.editedItem.value.$touch()"
                      v-model:trim="$v.editedItem.value.$model"
                    ></v-text-field>
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
        value: {required},
      }
    },
    data: () => ({
      releaseDatePicker: false,
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: 'نام', value: 'name'},
        {text: 'مقدار', value: 'value'},
        {text: 'تنظیمات', value: 'actions', sortable: false},
      ],
      settings: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        value: '',

      },
      defaultItem: {
        name: '',
        value: '',

      },
    }),

    computed: {
      nameErrors() {
        const errors = [];
        if (!this.$v.editedItem.name.$dirty) return errors;

        !this.$v.editedItem.name.required && errors.push('نام الزامی است');
        return errors
      },

      valueErrors() {
        const errors = [];
        if (!this.$v.editedItem.value.$dirty) return errors;

        !this.$v.editedItem.value.required && errors.push('مقدار الزامی است');
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
        this.settings = [
          {
            id: "1",
            name: 'example name',
            value: 'example value',

          },
        ]
      },

      editItem(item) {
        this.editedIndex = this.settings.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem(item) {
        this.editedIndex = this.settings.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm() {
        this.settings.splice(this.editedIndex, 1)
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
          Object.assign(this.settings[this.editedIndex], this.editedItem)
        } else {
          this.settings.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>

<style scoped>

</style>
