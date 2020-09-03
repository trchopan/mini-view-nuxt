<template>
  <client-only>
    <div v-if="showLayout" class="container" :class="layout">
      <router-link tag="button" class="back-arrow" type="button" to="/">
        &lt;
      </router-link>
      <div class="greeting">
        <h1 v-if="authUser">
          Welcome, <span class="user-name">{{ authUser.email }}</span>
        </h1>
        <h1 v-else>
          You are viewing shared screen with other users. Please login in
          <router-link class="text-underline" to="/">Home screen</router-link>
          to have your own view.
        </h1>
      </div>
      <div class="view">
        <div class="youtube-player">
          <youtube
            ref="youtube"
            resize
            :resize-delay="500"
            fit-parent
            :player-vars="playerVars"
            :video-id="videoID"
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
      playerVars: {
        autoplay: 0,
        playsinline: 1,
      },
      videoID: '',
      layout: '',
      dateStr: '',
      timeStr: '',
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
    this.debouncedLayout = debounce(() => {
      this.showLayout = true;
    }, 500);

    this.videoIDRef.on('value', this.handleVideoID);
    this.ytCommandRef.on('value', this.handleYTCommand);
    this.layoutRef.on('value', this.handleLayout);
  },
  beforeDestroy() {
    this.videoIDRef.off('value', this.handleVideoID);
    this.ytCommandRef.off('value', this.handleYTCommand);
    this.layoutRef.off('value', this.handleLayout);
  },
  methods: {
    makeDbRef(refStr) {
      const uid = (this.authUser && this.authUser.uid) || 'test';
      return this.$fireDb.ref(`${uid}/${refStr}`);
    },
    addZero(x) {
      return x >= 10 ? `${x}` : `0${x}`;
    },
    async handleYTCommand(snapshot) {
      const command = snapshot.val();
      if (!command) return;

      const player = this.$refs.youtube.player;
      const cmds = command.split('-');
      if (cmds.length === 1) {
        switch (cmds[0]) {
          case 'play':
            player.playVideo();
            break;
          case 'pause':
            player.pauseVideo();
            break;
        }
      } else {
        const curTime = await player.getCurrentTime();
        const seekTime = parseInt(cmds[1]);
        const seekTo =
          cmds[0] === 'back' ? curTime - seekTime : curTime + seekTime;
        // eslint-disable-next-line
        console.log('>>> seekTo', seekTo);
        player.seekTo(seekTo);
      }
      this.ytCommandRef.set(null);
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
    margin-top: 2rem;
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
      width: 100vw;
      @media (max-width: $breakpoint-sm) {
        flex-wrap: wrap;
      }
      .youtube-player,
      .clock-container {
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
        top: 1.5rem;
        right: 0;
        left: 0;
        bottom: 0;
        background: black;
      }
    }
  }
}
</style>
