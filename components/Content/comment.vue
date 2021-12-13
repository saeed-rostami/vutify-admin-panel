<template>
  <v-data-table
    :headers="headers"
    :items="comments"
    sort-by="id"
    class="elevation-1"
  >

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>نظرات</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn disabled color="primary" dark class="mb-2 disabled" v-bind="attrs" v-on="on">
              ایجاد
            </v-btn>
          </template>

        </v-dialog>
        <!--<v-dialog v-model="dialogDelete" max-width="500px">-->
        <!--<v-card>-->
        <!--<v-card-title class="text-h5"-->
        <!--&gt;آیا از حذف این آیتم اطمینان دارید؟-->
        <!--</v-card-title-->
        <!--&gt;-->
        <!--<v-card-actions>-->
        <!--<v-spacer></v-spacer>-->
        <!--<v-btn color="blue darken-1" text @click="closeDelete">لغو</v-btn>-->
        <!--<v-btn color="blue darken-1" text @click="deleteItemConfirm"-->
        <!--&gt;بله-->
        <!--</v-btn-->
        <!--&gt;-->
        <!--<v-spacer></v-spacer>-->
        <!--</v-card-actions>-->
        <!--</v-card>-->
        <!--</v-dialog>-->
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <ActionIcon
        v-bind:icon="` mdi-eye`"
        v-bind:tooltip="`نمایش`"
        v-bind:item="item"
        v-on:click="showComment(item)"
      />

      <ActionIcon
        v-if="item.approved == 0"
        v-bind:icon="`mdi-check-outline`"
        v-bind:tooltip="`تایید`"
        v-bind:item="item"
        v-on:click="confirmComment(item)"
      />


      <ActionIcon
        v-else
        v-bind:icon="` mdi-close`"
        v-bind:tooltip="`عدم تایید`"
        v-bind:item="item"
        v-on:click="confirmComment(item)"
      />

    </template>

    <template v-slot:no-data>
      <!--<v-btn color="primary" @click="initialize"> Reset</v-btn>-->
    </template>
  </v-data-table>
</template>

<script>
  import ActionIcon from "../CustomComponent/ActionIcon";
  import Crud from "../../classes/Crud";

  export default {
    components: {ActionIcon},

    props: {
      comments: {
        type: Array,
        required: false
      }
    },
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: "#", value: "id"},
        {text: "توسط", value: "user_name"},
        {text: "متن نظر", value: "body"},
        {text: "پست مربوط", value: "commentable"},
        {text: "وضعیت تایید", value: "approved_text"},
        {text: "وضعیت", value: "status_text"},
        {text: "تنظیمات", value: "actions", sortable: false},
      ],
      editedIndex: -1,
      editedItem: {
        user_id: "",
        user_name: "",
        body: "",
        approved_text: "",
        status: "",
        status_text: "",
        approved: "",
      },

      defaultItem: {
        user_id: "",
        user_name: "",
        body: "",
        approved_text: "",
        status: "",
        status_text: "",
        approved: "",

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


    methods: {
      confirmComment(item) {
        let path = 'content/comment/';
        Crud.confirmation(this.$axios, path, item.id,);
        let self = this;

        setTimeout(() => {
          self.$store.dispatch('Content/comment/getAllComments');
        }, 2000);
      },

      showComment(item) {
        console.log(item.id);
        // TODO GO TO SINGLE COMMENT
        // this.$router.push({
        //   path: 'admin/content/comment/' + item.id
        // })
      },


      editItem(item) {
        this.editedIndex = this.comments.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        this.editedIndex = this.comments.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        this.comments.splice(this.editedIndex, 1);
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
          Object.assign(this.comments[this.editedIndex], this.editedItem);
        } else {
          this.comments.push(this.editedItem);
        }
        this.close();
      },
    },
  };
</script>

<style scoped>
</style>
