<template>
  <v-data-table
    :headers="headers"
    :items="menus"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>منو ها</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
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
                  <v-col cols="12" sm="6" md="6">
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
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      clearable
                      v-model="editedItem.parent_id"
                      v-bind:label="parentsLabel"
                      v-bind:items="parentsCategory"

                    >

                      >
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="editedItem.url"
                                  label="لینک منو"
                                  :error-messages="urlErrors"
                                  required
                                  @input="$v.editedItem.url.$touch()"
                                  @blur="$v.editedItem.url.$touch()"
                                  v-model:trim="$v.editedItem.url.$model"
                    >

                    </v-text-field>
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

  export default {
    components: {DeleteDialog, ActionIcon},
    mixins: [validationMixin, Base, ValidationErrors],

    validations: {
      editedItem: {
        name: {required},
        // parent_id: {required},
        url: {required},
        status: {required},
      }
    },

    props: {
      menus: {
        type: Array,
        required: false
      }
    },

    data: () => ({
      parents: [],
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: "نام", value: "name"},
        {text: "منو والد", value: "parent_text"},
        {text: "لینک منو", value: "url"},
        {text: " وضعیت", value: "status_text"},
        {text: "تنظیمات", value: "actions", sortable: false},
      ],
      editedIndex: -1,
      editedItem: {
        name: "",
        parent_id: "",
        parent_text: "",
        url: "",
        status: "",
        status_text: "",
      },
      defaultItem: {
        name: "",
        parent_text: "",
        url: "",
        status: "",
        status_text: "",

      },
    }),

    mounted() {
      this.parents = this.menus.map(({name}) => name);
    },

    computed: {
      parentsCategory : function() {
       return this.parents = this.menus.map(({name}) => name);
      },

      parentsLabel() {
        return this.editedItem.parent_text ? this.editedItem.parent_text : ' منو والد';
      },
    },


    methods: {
      editItem(item) {
        this.editedIndex = this.menus.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        this.editedIndex = this.menus.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        let path = 'content/menu/';
        Crud.delete(this.editedItem.id, this.$axios, path);
        this.closeDelete();
        let self = this;
        setTimeout(() => {
          self.$store.dispatch('Content/menu/getAllMenus');
        }, 2000);
      },


      save() {
        let formData = new FormData();
        formData.append('name', this.editedItem.name);
        formData.append('url', this.editedItem.url);
        formData.append('status', this.editedItem.status);
        formData.append('parent_id', this.editedItem.parent_id);

        console.log(...formData);
        if (this.editedIndex > -1) {
          formData.append('_method', 'PUT');
          let path = 'content/menu/';
          Crud.update(formData, this.$axios, path, this.editedItem.id);
          this.close();
          let self = this;
          // formData.delete('parent_id');
          setTimeout(() => {
            self.$store.dispatch('Content/menu/getAllMenus');
          }, 2000);
        } else {
          let path = 'content/menu/';
          Crud.store(formData, this.$axios, path);
          this.close();
          // formData.delete('parent_id');
          let self = this;
          setTimeout(() => {
            self.$store.dispatch('Content/menu/getAllMenus');
          }, 2000);
        }
        this.close();
      },
    }
  };
</script>

<style scoped>
</style>
