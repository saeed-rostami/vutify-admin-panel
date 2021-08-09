<template>
  <v-data-table
    :headers="headers"
    :items="products"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:item.image="{ item }">
      <v-avatar>
        <img :src="item.image" alt="alt"/>
      </v-avatar>
    </template>

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>محصولات</v-toolbar-title>
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
                      v-model="editedItem.image"
                      :error-messages="imageErrors"
                      label="تصویر"
                      required
                      @input="$v.editedItem.image.$touch()"
                      @blur="$v.editedItem.image.$touch()"
                      v-model:trim="$v.editedItem.image.$model"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.price"
                      label="قیمت"
                      :error-messages="priceErrors"
                      required
                      @input="$v.editedItem.price.$touch()"
                      @blur="$v.editedItem.price.$touch()"
                      v-model:trim="$v.editedItem.price.$model"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.weight"
                      label="وزن"

                      :error-messages="weightErrors"
                      required
                      @input="$v.editedItem.weight.$touch()"
                      @blur="$v.editedItem.weight.$touch()"
                      v-model:trim="$v.editedItem.weight.$model"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="editedItem.category"
                      label="دسته"
                      v-bind:items="selectOptions"

                      :error-messages="categoryErrors"
                      required
                      @input="$v.editedItem.category.$touch()"
                      @blur="$v.editedItem.category.$touch()"
                      v-model:trim="$v.editedItem.category.$model"
                    >
                    </v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-bind:items="selectOptions"
                      v-model="editedItem.property"
                      label="فرم"

                      :error-messages="propertyErrors"
                      required
                      @input="$v.editedItem.property.$touch()"
                      @blur="$v.editedItem.property.$touch()"
                      v-model:trim="$v.editedItem.property.$model"
                    ></v-select>
                  </v-col>

                  <v-col cols="12">

                    <label>توضیحات</label>
                    <ckeditor v-model="editedItem.description" v-bind:config="ckConfig"/>
                    <!--<v-textarea-->
                    <!--v-model="editedItem.description"-->
                    <!--label="توضیحات"-->
                    <!--auto-grow-->
                    <!--outlined-->
                    <!--rows="3"-->
                    <!--row-height="25"-->
                    <!--shaped-->
                    <!--&gt;</v-textarea>-->
                  </v-col>

                  <!--PROPERTY-->
                  <v-col cols="12">
                    <v-row>
                      <v-col v-for="(input, index) in inputs" v-bind:key="index" cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="input.propertyName"
                          :name="propertyName"
                          label="ویژگی..."
                        ></v-text-field>

                        <v-text-field
                          v-model="input.propertyValue"
                          :name="propertyValue"
                          label="مقدار..."
                        ></v-text-field>

                        <v-btn rounded v-on:click="deleteRow(index)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-col>

                    </v-row>

                    <v-col cols="12" sm="6" md="6">
                      <v-btn rounded v-on:click="addRow">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-col>
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

      <ActionIcon
        v-bind:icon="`  mdi-dots-grid`"
        v-bind:tooltip="`فرم کالا`"
        v-bind:item="item"
        v-on:click="property(item)"
      />

      <ActionIcon
        v-bind:icon="`mdi-folder-multiple-image`"
        v-bind:tooltip="`گالری تصاویر`"
        v-bind:item="item"
        v-on:click="gallery(item)"
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

  let CKEditor;
  if (process.browser) {
    CKEditor = require("ckeditor4-vue")
  }
  export default {
    components: {
      DeleteDialog,
      ActionIcon,
      ckeditor: process.browser ? CKEditor.component : null,
    },

    mixins: [validationMixin],

    validations: {
      editedItem: {
        name: {required},
        image: {required},
        price: {required},
        weight: {required},
        category: {required},
        property: {required},
      }
    },


    data: () => ({
      ckConfig: {
        language: 'fa',
      },
      propertyName: "",
      propertyValue: "",
      inputs: [],
      selectOptions: ["Foo", "Bar", "Fizz", "Buzz"],
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: "نام", value: "name"},
        {text: "تصویر", value: "image"},
        {text: "قیمت", value: "price"},
        {text: "وزن", value: "weight"},
        {text: "دسته", value: "category"},
        {text: "فرم", value: "property"},
        {text: "تنظیمات", value: "actions", sortable: false},
      ],
      products: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        image: [],
        price: "",
        weight: "",
        category: "",
        property: "",
        description: "",
        inputs: []
      },
      defaultItem: {
        name: "",
        image: [],
        price: "",
        weight: "",
        category: "",
        property: "",
        description: "",
        inputs: []
      },
    }),

    computed:
      {
        nameErrors() {
          const errors = [];
          if (!this.$v.editedItem.name.$dirty) return errors;

          !this.$v.editedItem.name.required && errors.push('نام الزامی است');
          return errors
        },

        categoryErrors() {
          const errors = [];
          if (!this.$v.editedItem.category.$dirty) return errors;

          !this.$v.editedItem.category.required && errors.push(' دسته بندی الزامی است');
          return errors
        },

        imageErrors() {
          const errors = [];
          if (!this.$v.editedItem.image.$dirty) return errors;

          !this.$v.editedItem.image.required && errors.push('تصویر الزامی است');
          return errors
        },

        priceErrors() {
          const errors = [];
          if (!this.$v.editedItem.price.$dirty) return errors;

          !this.$v.editedItem.price.required && errors.push('قیمت الزامی است');
          return errors
        },

        weightErrors() {
          const errors = [];
          if (!this.$v.editedItem.weight.$dirty) return errors;

          !this.$v.editedItem.weight.required && errors.push('وزن الزامی است');
          return errors
        },

        propertyErrors() {
          const errors = [];
          if (!this.$v.editedItem.property.$dirty) return errors;

          !this.$v.editedItem.property.required && errors.push('ویژگی الزامی است');
          return errors
        },

        formTitle() {
          return this.editedIndex === -1 ? "ایجاد" : "ویرایش";
        }
        ,
      }
    ,

    watch: {
      dialog(val) {
        val || this.close();
      }
      ,
      dialogDelete(val) {
        val || this.closeDelete();
      }
      ,
    }
    ,

    created() {
      this.addRow();
      this.initialize();
    }
    ,

    methods: {

      deleteRow(index) {
        this.inputs.splice(index, 1);
      }
      ,

      addRow() {
        this.inputs.push({
          propertyName: "",
          propertyValue: "",
        });
      }
      ,
      initialize() {
        this.products = [
          {
            id: "1",
            name: "Iphone",
            image: "https://cdn.vuetifyjs.com/images/john.jpg",
            price: "200",
            weight: "1.5",
            category: "برقی",
            property: "xx",
            description: "",
            inputs: []

          },

          {
            id: "2",
            name: "samsung",
            image: require("@/static/avatar/man_4.jpg"),
            price: "500",
            weight: "5.5",
            category: "برقی",
            property: "ssxx",
            description: "",
            inputs: []

          },
        ];
      }
      ,

      editItem(item) {
        console.log('edit', item);

        this.editedIndex = this.products.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        console.log('delete', item);

        this.editedIndex = this.products.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },
      property(item) {
        console.log('property', item);

      },

      gallery(item) {
        console.log('gallery', item);

      },

      deleteItemConfirm() {
        this.products.splice(this.editedIndex, 1);
        this.closeDelete();
      }
      ,

      close() {
        this.dialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
      }
      ,

      closeDelete() {
        this.dialogDelete = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
      }
      ,

      save() {
        if (this.editedIndex > -1) {
          Object.assign(this.products[this.editedIndex], this.editedItem);
        } else {
          this.products.push(this.editedItem);
          this.editedItem.inputs.push(this.inputs);
          console.log(this.editedItem)
        }
        this.close();
      }
      ,
    }
    ,
  }
  ;
</script>

<style scoped>
</style>
