<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <!-- 1 -->
        <v-list-item
        v-for="(menu, index) in menus" :key="index"
         :to="menu.link"
          router
           exact>
          <v-list-item-action>
            <v-icon v-text="menu.icon"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="menu.title" />
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      categories: [],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "به سایت کوچک من خوش آمدید",

       menus: [
        {
          title: "Home",
          link: "/",
          icon: "mdi-home",
        },

        {
          title: "Electronics",
          link: "/electronics",
          icon: "mdi-Saeed",
        },

        {
          title: "Jewelery",
          link: "/jewelery",
          icon: "mdi-Saman",
        },
        {
          title: "Men",
          link: "/men clothing",
          icon: "mdi-Ali",
        },
        
        {
          title: "Women",
          link: "/women clothing",
          icon: "mdi-Ali",
        },
      ],
    };
  },

  mounted() {
    this.$axios
      .$get("https://fakestoreapi.com/products/categories")
      .then((response) => {
        this.categories = response;
      });
  },
};
</script>

