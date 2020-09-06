<template>
  <div class="youtube-container">
    <youtube
      ref="youtube"
      fit-parent
      :player-vars="playerVars"
      :video-id="videoID"
      @playing="setYTStatus('playing')"
      @paused="setYTStatus('pause')"
    ></youtube>
    <div v-if="debug">{{ debug }}</div>
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
      debug: '',
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
    this.ytVolmeRef = this.makeDbRef('youtube/volume');

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
      switch (cmds[0]) {
        case 'play':
          player.playVideo();
          break;
        case 'pause':
          player.pauseVideo();
          break;
        case 'back':
        case 'forward':
          await this.handleSeek(player, cmds);
          break;
        case 'volume':
          await this.handleVolume(player, cmds);
          break;
        default:
          // eslint-disable-next-line
          console.error('>>> Unknow cmds', cmds);
          break;
      }
      this.ytCommandRef.set(null);
    },
    handleVideoID(snapshot) {
      this.videoID = snapshot.val();
    },
    async handleSeek(player, cmds) {
      const curTime = await player.getCurrentTime();
      const seekTime = parseInt(cmds[1]);
      const seekTo =
        cmds[0] === 'back' ? curTime - seekTime : curTime + seekTime;
      // eslint-disable-next-line
      console.log('>>> seekTo', seekTo);
      player.seekTo(seekTo);
    },
    async handleVolume(player, cmds) {
      const curVolume = await player.getVolume();
      const volumnUp = 5;
      const volumnDown = 10;
      let newVolume =
        cmds[1] === 'down' ? curVolume - volumnDown : curVolume + volumnUp;
      if (newVolume < 0) {
        newVolume = 0;
      }
      if (newVolume > 100) {
        newVolume = 100;
      }
      // eslint-disable-next-line
      console.log('>>> volume', newVolume);
      this.debug = JSON.stringify({curVolume, newVolume});
      player.setVolume(newVolume);
      this.ytVolmeRef.set(newVolume);
    },
  },
});
</script>

<style lang="scss" scoped>
.youtube-container {
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
