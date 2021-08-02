<template>
  <v-menu
    offset-y
    origin="center center"
    class="elelvation-1"
    :nudge-right="40"
    :nudge-bottom="10"
    transition="scale-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn icon text slot="activator" v-on="on">
        <v-badge color="blue" overlap>
          <span slot="badge"> {{ notifications.length }}</span>
           <v-tooltip bottom>
      <template v-slot:activator="{ on }">
          <v-icon v-on="on" medium>mdi-bell-ring</v-icon>
           </template>
      <span>اعلانیه ها</span>
    </v-tooltip>
        </v-badge>
      </v-btn>
    </template>

    <v-list class="elevation-0">
      <v-toolbar flat dense color="transparent">
        <v-toolbar-title>اعلانیه ها</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text class="pa-0">
        <v-list two-line class="pa-0">
          <template v-for="(notification, index) in notifications">
            <v-subheader
              v-if="notification.header"
              :key="notification.header"
              >{{ notification.header }}</v-subheader
            >
            <v-divider
              v-else-if="notification.divider"
              :key="index"
            ></v-divider>
            <v-list-item href="#" v-else :key="notification.title">
              <v-list-item-avatar :color="notification.color">
                <v-icon dark>{{ notification.icon }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-black"
                  v-html="notification.title"
                ></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action class="caption">
                {{ notification.timeLabel }}
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
        <v-divider></v-divider>
        <v-btn block text class="ma-0">All</v-btn>
        <v-divider></v-divider>
      </v-card-text>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      notifications: [
        {
          title: "New user registered",
          color: "light-green",
          icon: "mdi-account-circle",
          timeLabel: "Just now",
        },
        { divider: true, inset: true },
        {
          title: "New order received",
          color: "light-blue",
          icon: "mdi-account-circle",
          timeLabel: "2 min ago",
        },
        { divider: true, inset: true },
        {
          title: "New payment made",
          color: "cyan",
          icon: "mdi-account-circle",
          timeLabel: "24 min ago",
        },
        { divider: true, inset: true },
        {
          title: "New message from Michael",
          color: "red",
          icon: "mdi-account-circle",
          timeLabel: "1 hour ago",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
