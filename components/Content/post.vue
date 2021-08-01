<template>
  <v-data-table
    :headers="headers"
    :items="posts"
    sort-by="name"
    class="elevation-1"
  >

    <template v-slot:item.image="{item}">
      <v-avatar
      >
        <img :src="item.image" alt="alt">
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
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="نام"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-select v-model="editedItem.category"
                              label="دسته بندی" v-bind:items="selectOptions">

                    </v-select>
                  </v-col>

                  <!--<v-col cols="12" sm="6" md="6">-->
                  <!--<v-menu-->
                  <!--v-model="releaseDatePicker"-->
                  <!--:close-on-content-click="false"-->
                  <!--:nudge-right="40"-->
                  <!--transition="scale-transition"-->
                  <!--offset-y-->
                  <!--min-width="auto"-->
                  <!--&gt;-->
                  <!--<template v-slot:activator="{ on, attrs }">-->
                  <!--<v-text-field-->
                  <!--v-model="editedItem.release"-->
                  <!--label="تاریخ انتشار"-->
                  <!--prepend-icon="mdi-calendar"-->
                  <!--readonly-->
                  <!--v-bind="attrs"-->
                  <!--v-on="on"-->
                  <!--&gt;</v-text-field>-->
                  <!--</template>-->
                  <!--<v-date-picker-->
                  <!--v-model="editedItem.release"-->
                  <!--@input="releaseDatePicker = false"-->
                  <!--&gt;</v-date-picker>-->
                  <!--</v-menu>-->
                  <!--</v-col>-->
                  <v-col cols="12" sm="6" md="6">
                    <client-only>
                      <label>تاریخ انتشار</label>
                      <PersianDatePicker v-model="editedItem.release"/>
                    </client-only>
                  </v-col>


                  <v-col cols="12" sm="6" md="6">
                    <v-file-input
                      v-model="editedItem.image"
                      label="تصویر"
                    ></v-file-input>
                  </v-col>

                  <v-col cols="12">
                    <label>توضیحات</label>
                    <ckeditor
                      v-model="editedItem.description"
                      v-bind:config="ckConfig"/>

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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">آیا از حذف این آیتم اطمینان دارید؟</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">لغو</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">بله</v-btn>
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

  let CKEditor;
  if (process.browser) {
    CKEditor = require("ckeditor4-vue")
  }

  export default {
    components: {
      PersianDatePicker: () => import('vue-persian-datetime-picker'),
      ckeditor: process.browser ? CKEditor.component : null,

    },

    data: () => ({
      ckConfig: {
        language: 'fa',
      },
      releaseDatePicker: false,
      selectOptions: ['Foo', 'Bar', 'Fizz', 'Buzz'],
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: 'نام', value: 'name'},
        {text: 'دسته بندی', value: 'category'},
        {text: 'تصویر', value: 'image'},
        {text: 'تنظیمات', value: 'actions', sortable: false},
      ],
      posts: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        category: '',
        image: '',
        description: '',
        release: '',
      },
      defaultItem: {
        name: '',
        category: '',
        image: '',
        description: '',
        release: '',
      },
    }),

    computed: {
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
        this.posts = [
          {
            id: "1",
            name: 'Iphone',
            category: 'الکترونیکی',
            description: 'الکترونیکی',
            image: "https://cdn.vuetifyjs.com/images/john.jpg",
            release: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
          },
        ]
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
        this.posts.splice(this.editedIndex, 1);
        this.closeDelete()
      },

      close() {
        this.dialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        })
      },

      closeDelete() {
        this.dialogDelete = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1
        })
      },

      save() {
        if (this.editedIndex > -1) {
          Object.assign(this.posts[this.editedIndex], this.editedItem)
        } else {
          this.posts.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>

<style scoped>

</style>
