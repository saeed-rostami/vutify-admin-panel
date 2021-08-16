export default {

  //COMPUTES
  computed: {
    isDisabled() {
      return !this.$v.$anyError;
    },

    formTitle() {
      return this.editedIndex === -1 ? 'ایجاد' : 'ویرایش'
    },
  },

//  WATCHES
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

//  METHODS
  methods: {
    clearValidation() {
      this.$v.$reset();
    },

    submitForm() {
      this.$v.$invalid ? this.$v.$touch() : this.save();
    },

    close() {
      this.clearValidation();
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1
      })
    },

  }
}
