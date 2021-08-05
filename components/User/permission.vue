<template>
  <v-data-table
    :headers="headers"
    :items="permissions"
    sort-by="id"
    class="elevation-1"
  >

    <template v-slot:item.roles="{ item }">

      <v-chip color="primary" v-for="(role ,i) in item.roles" v-bind:key="i">
        {{role}}
      </v-chip>

    </template>

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>سطح دسترسی</v-toolbar-title>
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
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="نام نقش"
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
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.description"
                      label="توضیح"
                      :error-messages="descriptionErrors"
                      required
                      @input="$v.editedItem.description.$touch()"
                      @blur="$v.editedItem.description.$touch()"
                      v-model:trim="$v.editedItem.description.$model"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    v-for="(role, i) in roles" v-bind:key="i"
                    cols="6"
                    sm="6"
                    md="6"
                  >
                    <v-checkbox
                      :value=role
                      :label=role
                    >
                    </v-checkbox>
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
            mdi-account-details
          </v-icon>
        </template>
        <span>نقش ها</span>
      </v-tooltip>

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
      <v-btn color="primary" @click="initialize"> Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  export default {
    mixins: [validationMixin],

    validations: {
      editedItem: {
        name: {required},
        description: {required},
      }
    },
    data: () => ({
      name: "permission",
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: "نام نقش", value: "name"},
        {text: "نقش ها", value: "roles"},
        {text: "تنظیمات", value: "actions", sortable: false},
      ],
      permissions: [],
      roles: [],
      editedIndex: -1,
      editedItem: {
        roles: "",
        description: "",
        name: "",
      },
      defaultItem: {
        roles: "",
        description: "",
        name: "",
      },
    }),

    computed: {
      nameErrors() {
        const errors = [];
        if (!this.$v.editedItem.name.$dirty) return errors;

        !this.$v.editedItem.name.required && errors.push('نام الزامی است');
        return errors
      },

      descriptionErrors() {
        const errors = [];
        if (!this.$v.editedItem.description.$dirty) return errors;

        !this.$v.editedItem.name.description && errors.push('توضیحات الزامی است');
        return errors
      },
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
      this.initialize();
      this.refreshRoles();
    },

    methods: {
      refreshRoles(){
        //TODO get all roles from api
        this.roles = [
          'edit',
          'delete',
          'update',
          'create',
        ]
      },


      initialize() {
        this.permissions = [
          {
            id: "1",
            name: "saeed",
            roles: [
              'edit',
              'delete',
              'update',
            ],
            description: "rostami",
          },

          {
            id: "2",
            name: "saman",
            roles: [
              'edit',
              'delete',
            ],
            description: "rostami",
          },
        ];
      },


      editItem(item) {
        // this.roles = [];
        this.roles = item.roles;
        this.editedIndex = this.permissions.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        this.editedIndex = this.permissions.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        this.permissions.splice(this.editedIndex, 1);
        this.closeDelete();
      },

      close() {
        this.refreshRoles();
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
          Object.assign(this.permissions[this.editedIndex], this.editedItem);
        } else {
          this.permissions.push(this.editedItem);
        }
        this.close();
      },
    },
  };
</script>

<style scoped>
</style>
