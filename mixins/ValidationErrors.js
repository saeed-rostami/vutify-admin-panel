export default {

  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;


      !this.$v.editedItem.name.required && errors.push('نام دسته بندی الزامی است');
      return errors
    },

    descriptionErrors() {
      const errors = []
      if (!this.$v.editedItem.description.$dirty) return errors;

      !this.$v.editedItem.description.required && errors.push(' توضیحات الزامی است');
      return errors
    },

    imageErrors() {
      const errors = []
      if (!this.$v.editedItem.image.$dirty) return errors;

      !this.$v.editedItem.image.required && errors.push(' تصویر الزامی است');
      return errors
    },

    statusErrors() {
      const errors = [];
      if (!this.$v.editedItem.status.$dirty) return errors;

      !this.$v.editedItem.status.required && errors.push(' وضعیت الزامی است');
      return errors
    },
  }
}
