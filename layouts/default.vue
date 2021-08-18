<template>
  <v-app app fixed>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      fixed
      right
      temporary
    >
      <v-list color="text--success">
        <v-list-item to="/">
          <v-icon color="success" right>mdi-home</v-icon>
          <v-list-item-title class="success--text">خانه</v-list-item-title>
        </v-list-item>

        <!-- MARKET -->
        <v-list-group>
          <v-list-item slot="activator">
            <v-icon right>mdi-shopping</v-icon>

            <v-list-item-title>بخش فروش</v-list-item-title>
          </v-list-item>

          <v-list-group sub-group no-action>
            <v-list-item slot="activator">
              <v-list-item-title>ویترین</v-list-item-title>
            </v-list-item>

            <v-list-item
              v-for="(market, i) in markets"
              :key="i"
              :to="market.to"
              dense
            >
              <v-list-item-title>{{ market.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-list-group sub-group no-action>
            <v-list-item slot="activator">
              <v-list-item-title>سفارشات</v-list-item-title>
            </v-list-item>

            <v-list-item
              dense
              v-for="(order, i) in orders"
              :key="i"
              :to="order.to"
            >
              <v-list-item-title>{{ order.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-list-group sub-group no-action>
            <v-list-item slot="activator">
              <v-list-item-title>تخفیف ها</v-list-item-title>
            </v-list-item>

            <v-list-item
              v-for="(discount, i) in discounts"
              :key="i"
              :to="discount.to"
              dense
            >
              <v-list-item-title>{{ discount.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-list-group sub-group no-action>
            <v-list-item slot="activator">
              <v-list-item-title>پرداخت ها</v-list-item-title>
            </v-list-item>

            <v-list-item
              v-for="(payment, i) in payments"
              :key="i"
              :to="payment.to"
              dense
            >
              <v-list-item-title>{{ payment.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-list-item :to="deliveries[0].to">
            <v-list-item-title>روش ارسال</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- CONTENT -->
        <v-list-group>
          <v-list-item slot="activator">
            <v-icon right>mdi-animation</v-icon>

            <v-list-item-title>بخش محتوا</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-for="(content, i) in contents"
            v-bind:key="i"
            :to="content.to"
          >
            <v-list-item-title>{{ content.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- USER -->
        <v-list-group>
          <v-list-item slot="activator">
            <v-icon right>mdi-account-circle</v-icon>

            <v-list-item-title>بخش کاربران</v-list-item-title>
          </v-list-item>

          <v-list-item v-for="(user, i) in users" v-bind:key="i" :to="user.to">
            <v-list-item-title>{{ user.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- TICKET -->
        <v-list-group>
          <v-list-item slot="activator">
            <v-icon right>mdi-ticket</v-icon>

            <v-list-item-title>بخش تیکت ها</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-for="(ticket, i) in tickets"
            v-bind:key="i"
            :to="ticket.to"
          >
            <v-list-item-title>{{ ticket.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- NOTIFY -->
        <v-list-group>
          <v-list-item slot="activator">
            <v-icon right>mdi-bell-ring</v-icon>

            <v-list-item-title>بخش اعلانیه ها</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-for="(notification, i) in notifications"
            v-bind:key="i"
            :to="notification.to"
          >
            <v-list-item-title>{{ notification.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- SETTING -->
        <v-list-group>
          <v-list-item slot="activator">
            <v-icon right>mdi-cog-outline</v-icon>

            <v-list-item-title>تنظیمات</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-for="(setting, i) in settings"
            v-bind:key="i"
            :to="setting.to"
          >
            <v-list-item-title>{{ setting.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" color="success" elevation="17" fab icon outlined plain to="/">
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </template>
        <span>صفحه اصلی</span>

      </v-tooltip>

      <v-spacer></v-spacer>

      <app-toolbar></app-toolbar>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt/>
      </v-container>
    </v-main>

    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>


<script>
  import AppToolbar from "./AppToolbar.vue";

  export default {
    components: {AppToolbar},
    data() {
      return {
        clipped: false,
        drawer: false,
        fixed: false,
        right: true,
        rightDrawer: true,
        title: "پنل مدیریت",

        markets: [
          {title: "دسته بندی", to: "/admin/market/category"},
          {title: "فرم کالا", to: "/admin/market/property"},
          {title: "برند ها", to: "/admin/market/brand"},
          {title: "محصولات", to: "/admin/market/product"},
          {title: "انبار", to: "/admin/market/store"},
          {title: "نظرات", to: "/admin/market/comment"},
        ],
        orders: [
          {title: "همه سفارشات", to: "/admin/market/order/all"},
          {title: "جدید", to: "/admin/market/order/new"},
          {title: "در حال ارسال", to: "/admin/market/order/sending"},
          {title: "پرداخت نشده", to: "/admin/market/order/unpaid"},
          {title: "لغو شده", to: "/admin/market/order/canceled"},
          {title: "مرجوعی", to: "/admin/market/order/failed"},
        ],

        discounts: [
          {title: "کوپن تخفیف", to: "/admin/market/discount/coupon"},
          {title: "تخفیف عمومی", to: "/admin/market/discount/general"},
          {title: "فروش شگفت انگیز", to: "/admin/market/discount/amazing"},
        ],

        payments: [
          {title: "همه پرداخت ها", to: "/admin/market/payment/all"},
          {title: "پرداخت های آنلاین", to: "/admin/market/payment/online"},
          {title: "پرداخت های آفلاین", to: "/admin/market/payment/offline"},
          {title: "پرداخت در محل", to: "/admin/market/payment/location"},
        ],

        deliveries: [{title: "روش های ارسال", to: "/admin/market/delivery"}],
        contents: [
          {title: "دسته بندی", to: "/admin/content/category"},
          {title: "پست", to: "/admin/content/post"},
          {title: "منو", to: "/admin/content/menu"},
          {title: "سوالات متداول", to: "/admin/content/faq"},
          {title: "پیج ساز", to: "/admin/content/page"},
          {title: "نظرات", to: "/admin/content/comment"},
        ],

        users: [
          {title: "مدیران", to: "/admin/user/admin"},
          {title: "مشتریان", to: "/admin/user/customer"},
          {title: "سطوح دسترسی", to: "/admin/user/permission"},
        ],

        tickets: [
          {title: "تیکت های جدید", to: "/admin/ticket/new"},
          {title: "تیکت های باز", to: "/admin/ticket/open"},
          {title: "تیکت های بسته", to: "/admin/ticket/closed"},
        ],

        notifications: [
          {title: "اعلان ایمیلی", to: "/admin/notify/email"},
          {title: "اعلان پیامکی", to: "/admin/notify/sms"},
        ],

        settings: [{title: "تنظیمات", to: "/admin/setting"}],
      };
    },

  };
</script>

<style scoped>
  .v-list-item--active {
    color: forestgreen;
  }
</style>

   

