<template>
  <!-- eslint-disable-next-line -->
  <div v-html="embed" class="custom-style"></div>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';

export default Vue.extend({
  data() {
    return {
      embed: '',
    };
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
  },
  mounted() {
    this.embedRef = this.makeDbRef('embed');
    this.embedRef.on('value', this.handleEmbed);
  },
  beforeDestroy() {
    this.embedRef.off('value', this.handleEmbed);
  },
  methods: {
    makeDbRef(refStr) {
      const uid = (this.authUser && this.authUser.uid) || 'test';
      return this.$fireDb.ref(`${uid}/${refStr}`);
    },
    handleEmbed(snapshot) {
      this.embed = snapshot.val();
    },
  },
});
</script>

<style lang="scss" scoped></style>
