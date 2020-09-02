<template>
  <client-only>
    <div class="container" :class="layout" v-if="showLayout">
      <router-link tag="button" class="back-arrow" type="button" to="/">
        &lt;
      </router-link>
      <div class="greeting">
        <h1 v-if="authUser">
          Welcome, <span class="user-name">{{ authUser.email }}</span>
        </h1>
        <h1 v-else>
          Please login in <router-link to="/">Home screen</router-link>
        </h1>
      </div>
      <div v-if="authUser" class="view">
        <div class="youtube-player">
          <youtube
            ref="youtube"
            resize
            fit-parent
            :video-id="videoID"
            @playing="playing"
          ></youtube>
        </div>
        <div class="clock-container">
          <div>
            <div class="date">{{ dateStr }}</div>
            <div class="time">{{ timeStr }}</div>
          </div>
        </div>
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
      player: null,
      videoID: '',
      layout: '',
      dateStr: '',
      timeStr: '',
      showLayout: true,
    };
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
  },
  mounted() {
    if (!this.authUser) {
      this.$router.replace('/');
      return;
    }
    setInterval(() => {
      const now = new Date();
      const date = this.addZero(now.getDate());
      const month = this.addZero(now.getMonth() + 1);
      const year = this.addZero(now.getFullYear());
      const hour = this.addZero(now.getHours());
      const minute = this.addZero(now.getMinutes());
      const second = this.addZero(now.getSeconds());
      this.dateStr = `${date}-${month}-${year}`;
      this.timeStr = `${hour}:${minute}:${second}`;
    }, 1000);
    this.videoIDRef = this.makeDbRef('youtube/videoID');
    this.ytCommandRef = this.makeDbRef('youtube/command');
    this.layoutRef = this.makeDbRef('layout');
    this.debouncedLayout = debounce(() => (this.showLayout = true), 500);

    this.videoIDRef.on('value', this.handleVideoID);
    this.layoutRef.on('value', this.handleLayout);
  },
  beforeDestroy() {
    this.videoIDRef.off('value', this.handleVideoID);
    this.layoutRef.off('value', this.handleLayout);
  },
  methods: {
    playing() {
      // eslint-disable-next-line
      console.log('\\o/ we are watching!!!');
    },
    makeDbRef(refStr) {
      if (!this.authUser) return {on: () => {}};
      return this.$fireDb.ref(`${this.authUser.uid}/${refStr}`);
    },
    addZero(x) {
      return x >= 10 ? `${x}` : `0${x}`;
    },
    handleVideoID(snapshot) {
      this.videoID = snapshot.val();
    },
    handleLayout(snapshot) {
      this.showLayout = false;
      const layout = snapshot.val();
      this.layout = layout || 'layout-1';
    },
  },
  watch: {
    layout(val, oldVal) {
      this.debouncedLayout();
    },
  },
});
</script>

<style lang="scss" scoped>
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
    h1 {
      text-align: center;
      font-size: 0.8rem;
    }
  }
  &.layout-1 {
    .view {
      flex: 1;
      display: flex;
      width: 100%;
      .youtube-player,
      .clock-container {
        flex-basis: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      .youtube-player {
      }
      .clock-container {
        div {
          .date {
            color: #545454;
            font-size: 2rem;
          }
          .time {
            font-size: 5rem;
          }
        }
      }
    }
  }
  &.layout-2 {
    .view {
      .youtube-player {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: black;
      }
    }
  }
}
</style>
