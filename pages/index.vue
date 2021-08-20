<template>
  <v-layout row>
    <v-col>
      <h1>
        Welcome
      </h1>

      <client-only>
        <Select2
          multiple
          taggable
          v-model="selected"
          label="name"
          placeholder="برچسب ها..."
        />
      </client-only>


      <!-- </nuxt-link> -->
    </v-col>
  </v-layout>
</template>


<script>

  export default {
    name: "index",
    data () {
      return {
        selected: [
          'sara','maryam' ,'ali'
        ],
        // options: [
          // { name: 'Vue.js' },
          // { name: 'Javascript' },
          // { name: 'Open Source'}
        // ]
      }
    },
    methods: {
      go: function() {window.alert('go')},
      addTag (newTag) {
        const tag = {
          name: newTag,
          code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
        }
        this.options.push(tag)
        this.value.push(tag)
      }
    }


  }
</script>
