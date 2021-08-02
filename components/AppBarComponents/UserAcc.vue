<template>
  <!-- USER -->
  <v-menu
    offset-y
    origin="center center"
    :nudge-left="140"
    :nudge-bottom="10"
    transition="scale-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn icon medium text v-on="on">
        <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-avatar size="30px" v-on="on">
          <img src="@/static/avatar/man_4.jpg" alt="Michael Wang" />
        </v-avatar>
         </template>
      <span>حساب کاربری</span>
    </v-tooltip>
      </v-btn>
    </template>

    <v-list class="pa-0">
      <v-list-item
        v-for="(item, index) in items"
        :to="item.href"
        @click="item.click"
        ripple="ripple"
        :disabled="item.disabled"
        :target="item.target"
        rel="noopener"
        :key="index"
      >
        <v-list-item-avatar :color="item.color">
          <v-icon >{{ item.icon }}</v-icon>
        </v-list-item-avatar>

        <v-list-item-title class="font-weight-medium">{{
          item.title
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          icon: "mdi-account-cog",
          href: "/admin/account",
          title: "حساب کابری",
          
        },
        {
          icon: "mdi-cog",
          href: "/admin/setting",
          title: "تنظیمات",
        
        },
        {
          icon: "mdi-power",
          href: "#",
          title: "خروج",
          color: "red accent-3",
          click: (e) => {
            alert('logout admin')
          },
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>