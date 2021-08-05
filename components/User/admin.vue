<template>
  <v-data-table
    :headers="headers"
    :items="admins"
    sort-by="id"
    class="elevation-1"
  >

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>مدیران</v-toolbar-title>
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
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.family"
                      label="نام خانوادگی"
                      :error-messages="familyErrors"
                      :counter="32"
                      required
                      @input="$v.editedItem.family.$touch()"
                      @blur="$v.editedItem.family.$touch()"
                      v-model:trim="$v.editedItem.family.$model"
                    ></v-text-field>
                  </v-col>


                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.phone"
                      label="موبایل"
                      :error-messages="phoneErrors"
                      :counter="11"
                      required
                      @input="$v.editedItem.phone.$touch()"
                      @blur="$v.editedItem.phone.$touch()"
                      v-model:trim="$v.editedItem.phone.$model"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.email"
                      label="ایمیل"
                      :error-messages="emailErrors"
                      required
                      @input="$v.editedItem.email.$touch()"
                      @blur="$v.editedItem.email.$touch()"
                      v-model:trim="$v.editedItem.email.$model"
                    ></v-text-field>
                  </v-col>


                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.password"
                      label="رمز عبور"
                      :error-messages="passwordErrors"
                      required
                      @input="$v.editedItem.password.$touch()"
                      @blur="$v.editedItem.password.$touch()"
                      v-model:trim="$v.editedItem.password.$model"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.c_password"
                      label=" تکرار رمز عبور"
                      :error-messages="c_passwordErrors"
                      required
                      @input="$v.editedItem.c_password.$touch()"
                      @blur="$v.editedItem.c_password.$touch()"
                      v-model:trim="$v.editedItem.c_password.$model"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-select v-model="editedItem.status"
                              label="وضعیت"  v-bind:items="statusOptions"
                              :error-messages="statusErrors"
                              required
                              @input="$v.editedItem.status.$touch()"
                              @blur="$v.editedItem.status.$touch()"
                              v-model:trim="$v.editedItem.status.$model"
                    >
                    </v-select>
                  </v-col>


                  <v-col cols="12" sm="6" md="6">
                    <v-file-input
                      v-model="editedItem.avatar"
                      label="آواتار"
                    ></v-file-input>
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
  import {required, email , sameAs, minLength , numeric, maxLength} from 'vuelidate/lib/validators'
  export default {
    mixins: [validationMixin],

    validations: {
      editedItem: {
        name: {required},
        family: {required},
        phone: {required , numeric, maxLength: maxLength(11), minLength: minLength(11)},
        status: {required},
        email: {required , email},
        password: {required,  minLength: minLength(6)},
        c_password: {required , sameAsPassword: sameAs('password')},
      }
    },
    data: () => ({

      statusOptions: ['active' , 'deactive'],
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: "ایمیل", value: "email"},
        {text: "موبایل", value: "phone"},
        {text: "نام", value: "name"},
        {text: "نام خانوادگی", value: "family"},
        {text: "وضعیت", value: "status"},
        {text: "تنظیمات", value: "actions", sortable: false},
      ],
      admins: [],
      editedIndex: -1,
      editedItem: {
        email: "",
        phone: "",
        name: "",
        family: "",
        status: "",
        avatar: "",
        password: "",
        c_password: "",

      },
      defaultItem: {
        email: "",
        phone: "",
        name: "",
        family: "",
        status: "",
        avatar: "",
        password: "",
        c_password: "",
      },
    }),

    computed: {
      nameErrors() {
        const errors = [];
        if (!this.$v.editedItem.name.$dirty) return errors;

        !this.$v.editedItem.name.required && errors.push('نام الزامی است');
        return errors
      },

      familyErrors() {
        const errors = [];
        if (!this.$v.editedItem.family.$dirty) return errors;

        !this.$v.editedItem.family.required && errors.push('نام خانوادگی الزامی است');
        return errors
      },

      emailErrors() {
        const errors = [];
        if (!this.$v.editedItem.email.$dirty) return errors;

        !this.$v.editedItem.email.required && errors.push('ایمیل الزامی است');
        !this.$v.editedItem.email.email && errors.push('ایمیل نا معتبر است');
        return errors
      },
      phoneErrors() {
        const errors = [];
        if (!this.$v.editedItem.phone.$dirty) return errors;

        !this.$v.editedItem.phone.required && errors.push('موبایل الزامی است');
        !this.$v.editedItem.phone.numeric && errors.push('کارکتر غیر مجاز است');
        !this.$v.editedItem.phone.maxLength && errors.push('شماره موبایل باید 11 رقم باشد');
        !this.$v.editedItem.phone.minLength && errors.push('شماره موبایل باید 11 رقم باشد');
        return errors
      },


      passwordErrors() {
        const errors = [];
        if (!this.$v.editedItem.password.$dirty) return errors;

        !this.$v.editedItem.password.required && errors.push('رمز عبور الزامی است');
        !this.$v.editedItem.password.minLength && errors.push('رمز عبور باید بالای 6 کارکتر باشد');
        return errors
      },

      c_passwordErrors() {
        const errors = [];
        if (!this.$v.editedItem.c_password.$dirty) return errors;

        !this.$v.editedItem.c_password.required && errors.push('تکرار رمز عبور الزامی است');
        !this.$v.editedItem.c_password.sameAsPassword && errors.push('تکرار رمز عبور با رمز عبور مغایرت دارد');
        return errors
      },

      statusErrors() {
        const errors = [];
        if (!this.$v.editedItem.status.$dirty) return errors;

        !this.$v.editedItem.status.required && errors.push('وضعیت الزامی است');
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
    },

    methods: {
      initialize() {
        this.admins = [
          {
            id: "1",
            name: "saeed",
            family: "rostami",
            phone: "09119381867",
            status: "فعال",
            email: "saeedrostami1991@gmail.com",
            avatar: "",
            password: "",
            c_password: "",
          },


        ];
      },

      editItem(item) {
        this.editedIndex = this.admins.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        this.editedIndex = this.admins.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        this.admins.splice(this.editedIndex, 1);
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
          Object.assign(this.admins[this.editedIndex], this.editedItem);
        } else {
          this.admins.push(this.editedItem);
        }
        this.close();
      },
    },
  };
</script>

<style scoped>
</style>
