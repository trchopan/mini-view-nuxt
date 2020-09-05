<template>
  <div>
    <youtube
      ref="youtube"
      resize
      :resize-delay="500"
      fit-parent
      :player-vars="playerVars"
      :video-id="videoID"
      @playing="setYTStatus('playing')"
      @paused="setYTStatus('pause')"
    ></youtube>
    <div class="yt-time">{{ ytTime }}</div>
  </div>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';

export default Vue.extend({
  data() {
    return {
      playerVars: {
        autoplay: 0,
        playsinline: 1,
      },
      videoID: '',
      ytTime: '',
    };
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
  },
  mounted() {
    this.videoIDRef = this.makeDbRef('youtube/videoID');
    this.ytCommandRef = this.makeDbRef('youtube/command');
    this.ytStatusRef = this.makeDbRef('youtube/status');

    this.videoIDRef.on('value', this.handleVideoID);
    this.ytCommandRef.on('value', this.handleYTCommand);
  },
  beforeDestroy() {
    this.videoIDRef.off('value', this.handleVideoID);
    this.ytCommandRef.off('value', this.handleYTCommand);
  },
  methods: {
    makeDbRef(refStr) {
      const uid = (this.authUser && this.authUser.uid) || 'test';
      return this.$fireDb.ref(`${uid}/${refStr}`);
    },
    setYTStatus(status) {
      this.ytStatusRef.set(status);
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
  },
});
</script>
