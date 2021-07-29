<template>
  <v-data-table
    :headers="headers"
    :items="notifications"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>اعلانیه های پیامکی</v-toolbar-title>
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
                      v-model="editedItem.title"
                      label="عنوان اطلاعیه"
                    ></v-text-field>
                  </v-col>


                  <v-col cols="12" sm="6" md="4">
                    <v-menu
                      v-model="releaseDatePicker"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.releaseDate"
                          label="تاریخ ارسال"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.releaseDate"
                        @input="releaseDatePicker = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12">

                    <v-textarea
                      v-model="editedItem.text"
                      label="توضیحات"
                      auto-grow
                      outlined
                      rows="3"
                      row-height="25"
                      shaped
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
  export default {

    data: () => ({
      releaseDatePicker: false,
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: "#", value: "id" },
        { text: 'نام', value: 'title' },
        { text: 'تاریخ ارسال', value: 'releaseDate' },
        { text: 'تنظیمات', value: 'actions', sortable: false },
      ],
      notifications: [],
      editedIndex: -1,
      editedItem: {
        title: '',
        releaseDate: '',
        text: '',

      },
      defaultItem: {
        title: '',
        releaseDate: '',
        text: '',
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'ایجاد' : 'ویرایش'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.notifications = [
          {
            id: "1",
            title: 'Iphone',
            releaseDate: '2020',
            text: 'example text',
          },
        ]
      },

      editItem (item) {
        this.editedIndex = this.notifications.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.notifications.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.notifications.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.notifications[this.editedIndex], this.editedItem)
        } else {
          this.notifications.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>

<style scoped>

</style>
