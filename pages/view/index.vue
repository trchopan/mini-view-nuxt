<template>
  <client-only>
    <div v-if="showLayout" class="container">
      <router-link tag="button" class="back-arrow" type="button" to="/">
        &lt;
      </router-link>
      <div class="greeting">
        <Welcome v-if="authUser" :auth-user="authUser" small />
        <SharedView v-else small />
      </div>
      <div class="view" :class="layout">
        <div class="youtube-player">
          <YoutubePlayer />
        </div>
        <div class="clock">
          <div>
            <Clock />
          </div>
        </div>
      </div>
      <div v-if="authUser" class="view-2">
        <CustomEmbed class="embed" />
      </div>
    </div>
  </client-only>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';
import {debounce} from 'lodash';

export default Vue.extend({
  data() {
    return {
      playerVars: {
        autoplay: 0,
        playsinline: 1,
      },
      videoID: '',
      layout: '',
      showLayout: false,
    };
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
  },
  watch: {
    layout(val, oldVal) {
      this.debouncedLayout();
    },
  },
  mounted() {
    this.layoutRef = this.makeDbRef('layout');
    this.debouncedLayout = debounce(() => {
      this.showLayout = true;
    }, 500);

    this.layoutRef.on('value', this.handleLayout);
  },
  beforeDestroy() {
    this.layoutRef.off('value', this.handleLayout);
  },
  methods: {
    makeDbRef(refStr) {
      const uid = (this.authUser && this.authUser.uid) || 'test';
      return this.$fireDb.ref(`${uid}/${refStr}`);
    },
    handleLayout(snapshot) {
      this.showLayout = false;
      const layout = snapshot.val();
      this.layout = layout || 'layout-1';
    },
  },
});
</script>

<style lang="scss" scoped>
@import '~/assets/_variables.scss';

.container {
  max-width: none;
  height: 100vh;
  .back-arrow {
    position: absolute;
    top: 0rem;
    left: 0rem;
    background: inherit;
    color: inherit;
    border: none;
  }
  .greeting {
    flex: none;
    @media (max-width: $breakpoint-sm) {
      margin-top: 2rem;
    }
  }
  .view {
    &.layout-1 {
      flex: 1;
      display: flex;
      width: 100vw;
      @media (max-width: $breakpoint-sm) {
        flex-wrap: wrap;
      }
      .youtube-player,
      .clock {
        width: 100%;
        flex-basis: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        @media (max-width: $breakpoint-sm) {
          flex-basis: 100%;
          margin: auto;
        }
      }
    }
    &.layout-2 {
      .youtube-player {
        position: fixed;
        top: 1.5rem;
        right: 0;
        left: 0;
        bottom: 0;
        background: black;
      }
    }
  }
  .view-2 {
    display: flex;
    .embed {
      flex-basis: 50%;
    }
    .live-string {
    }
  }
}
</style>
