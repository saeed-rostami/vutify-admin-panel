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
                      :error-messages="titleErrors"
                      :counter="32"
                      required
                      @input="$v.editedItem.title.$touch()"
                      @blur="$v.editedItem.title.$touch()"
                      v-model:trim="$v.editedItem.title.$model"
                    ></v-text-field>
                  </v-col>


                  <v-col cols="12" sm="6" md="4">
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
                    <!--v-model="editedItem.releaseDate"-->
                    <!--label="تاریخ ارسال"-->
                    <!--prepend-icon="mdi-calendar"-->
                    <!--readonly-->
                    <!--v-bind="attrs"-->
                    <!--v-on="on"-->
                    <!--&gt;</v-text-field>-->
                    <!--</template>-->
                    <!--<v-date-picker-->
                    <!--v-model="editedItem.releaseDate"-->
                    <!--@input="releaseDatePicker = false"-->
                    <!--&gt;</v-date-picker>-->
                    <!--</v-menu>-->

                    <client-only>
                      <label>تاریخ انتشار</label>
                      <PersianDatePicker v-model="editedItem.releaseDate"/>
                    </client-only>
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

    components: {
      DeleteDialog,
      ActionIcon,
      PersianDatePicker: () => import('vue-persian-datetime-picker'),
    },

    mixins: [validationMixin],

    validations: {
      editedItem: {
        title: {required},
      }
    },
    data: () => ({
      releaseDatePicker: false,
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: 'عنوان', value: 'title'},
        {text: 'تاریخ ارسال', value: 'releaseDate'},
        {text: 'تنظیمات', value: 'actions', sortable: false},
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
      titleErrors() {
        const errors = [];
        if (!this.$v.editedItem.title.$dirty) return errors;

        !this.$v.editedItem.title.required && errors.push('عنوان اطلاعیه الزامی است');
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
        this.notifications = [
          {
            id: "1",
            title: 'Iphone',
            releaseDate: '2020',
            text: 'example text',
          },
        ]
      },

      editItem(item) {
        this.editedIndex = this.notifications.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem(item) {
        this.editedIndex = this.notifications.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm() {
        this.notifications.splice(this.editedIndex, 1)
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
