<template>
  <div class=" d-flex justify-center">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <v-btn small fab v-on:click="toTheme" v-on="on">
            <v-icon medium>{{ changeTheme }}</v-icon>
          </v-btn>
        </div>
      </template>
      <span>تغییر رنگ پوسته</span>
    </v-tooltip>

    <notifications />

    <user-acc />
  </div>
</template>

<script>
import Notifications from "../components/CustomComponent/AppBarComponents/Notifications.vue";
import UserAcc from "../components/CustomComponent/AppBarComponents/UserAcc.vue";
export default {
  components: { UserAcc, Notifications },
  name: "AppToolbar",

  data() {
    return {
      theme: "",
    };
  },
  methods: {
    toTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
  computed: {
    changeTheme() {
      return this.$vuetify.theme.dark
        ? "mdi-white-balance-sunny"
        : " mdi-moon-waning-crescent ";
    },
  },
};
</script>
  
<style lang="scss" scoped>
</style>
