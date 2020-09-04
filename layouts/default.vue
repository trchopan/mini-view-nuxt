<template>
  <div>
    <Nuxt :nuxt-child-key="`key-${authUser && authUser.uid}`" />
  </div>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';

export default Vue.extend({
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
  },
});
</script>

<style lang="scss"></style>
