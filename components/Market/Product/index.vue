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
        <v-dialog v-model="dialog" max-width="500px">
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
                      label="نام"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-file-input
                      v-model="editedItem.image"
                      label="تصویر"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.price"
                      label="قیمت"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.weight"
                      label="وزن"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="editedItem.category"
                      label="دسته"
                      v-bind:items="selectOptions"
                    >
                    </v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-bind:items="selectOptions"
                      v-model="editedItem.property"
                      label="فرم"
                    ></v-select>
                  </v-col>

                  <v-col cols="12">

                    <v-textarea
                      v-model="editedItem.description"
                      label="توضیحات"
                      auto-grow
                      outlined
                      rows="3"
                      row-height="25"
                      shaped
                    ></v-textarea>
                  </v-col>

                  <!--PROPERTY-->
                  <v-col cols="12" >
                    <v-row>
                      <v-col v-for="(input, index) in inputs" v-bind:key="index" cols="12" sm="6" md="4">
                        <v-text-field
                          :name="propertyName"
                          label="ویژگی..."
                        ></v-text-field>

                        <v-text-field
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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
            >آیا از حذف این آیتم اطمینان دارید؟
            </v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">لغو</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
              >بله
              </v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            v-on="on"
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
        </template>
        <span>ویرایش</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <span>حذف</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" small @click="deleteItem(item)">
            mdi-dots-grid
          </v-icon>
        </template>
        <span>فرم کالا</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" small @click="deleteItem(item)">
            mdi-folder-multiple-image
          </v-icon>
        </template>
        <span>گالری تصاویر</span>
      </v-tooltip>
    </template>

    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    data: () => ({
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
        image: "",
        price: "",
        weight: "",
        category: "",
        property: "",
        description: "",

      },
      defaultItem: {
        name: "",
        image: "",
        price: "",
        weight: "",
        category: "",
        property: "",
        description: "",
      },
    }),

    computed: {
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
      this.addRow();
      this.initialize();
    },

    methods: {

      deleteRow(index) {
        this.inputs.splice(index, 1);
      },

      addRow() {
        this.inputs.push({
          propertyName: "",
          propertyValue: "",
        });
      },
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

          },
        ];
      },

      editItem(item) {
        this.editedIndex = this.products.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        this.editedIndex = this.products.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        this.products.splice(this.editedIndex, 1);
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
          Object.assign(this.products[this.editedIndex], this.editedItem);
        } else {
          this.products.push(this.editedItem);
        }
        this.close();
      },
    },
  };
</script>

<style scoped>
</style>
