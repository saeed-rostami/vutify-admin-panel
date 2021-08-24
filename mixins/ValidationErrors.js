export default {

  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;

      !this.$v.editedItem.name.required && errors.push('نام الزامی است');
      return errors
    },

    titleErrors() {
      const errors = [];
      if (!this.$v.editedItem.title.$dirty) return errors;

      !this.$v.editedItem.title.required && errors.push('نام الزامی است');
      return errors
    },

    categoryErrors() {
      const errors = [];
      if (!this.$v.editedItem.category_id.$dirty) return errors;


      !this.$v.editedItem.category_id.required && errors.push(' دسته بندی الزامی است');
      return errors
    },

    descriptionErrors() {
      const errors = []
      if (!this.$v.editedItem.description.$dirty) return errors;

      !this.$v.editedItem.description.required && errors.push(' توضیحات الزامی است');
      return errors
    },

    summaryErrors() {
      const errors = []
      if (!this.$v.editedItem.summary.$dirty) return errors;

      !this.$v.editedItem.summary.required && errors.push(' خلاصه الزامی است');
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

    commentableErrors() {
      const errors = [];
      if (!this.$v.editedItem.commentable.$dirty) return errors;

      !this.$v.editedItem.commentable.required && errors.push(' اجازه ارسال دیدگاه الزامی است');
      return errors
    },
  }
}
