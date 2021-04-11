<template>
  <client-only>
    <div class="container">
      <router-link tag="button" class="back-arrow" type="button" to="/">
        &lt;
      </router-link>
      <div class="greeting">
        <Welcome v-if="authUser" :auth-user="authUser" />
        <SharedView v-else />
      </div>
      <div class="controller">
        <div class="yt-cover">
          <span class="play-pause-status">{{ ytStatus }}</span>
          <span class="volume">
            Vol {{ ytVolume !== null && ytVolume.toString() }}
          </span>
          <img :src="ytImgSrc" alt="" />
        </div>
        <div class="my-3">
          <button
            type="button"
            class="btn-primary"
            @click="sendSimpleCmd('play')"
          >
            Play
          </button>
          <button
            type="button"
            class="btn-secondary"
            @click="sendSimpleCmd('pause')"
          >
            Pause
          </button>
        </div>
        <div class="input-group my-3">
          <input v-model="inputID" placeholder="Youtube link" />
          <div class="input-group-append">
            <button type="button" class="btn-primary" @click="updateYoutubeID">
              Update
            </button>
            <button type="button" @click="youtubeClipboard">Clipboard</button>
          </div>
        </div>
        <template v-if="authUser">
          <div class="input-group my-3">
            <input v-model="embed" placeholder="Embed code" />
            <div class="input-group-append">
              <button type="button" class="btn-primary" @click="updateEmbed">
                Update
              </button>
              <button type="button" @click="embedClipboard">Clipboard</button>
            </div>
          </div>
          <div class="input-group my-3">
            <input v-model="clip" placeholder="Clip text" />
            <div class="input-group-append">
              <button type="button" class="btn-primary" @click="updateClip">
                Update
              </button>
            </div>
          </div>
          <div class="my-3">
            <button
              type="button"
              class="btn-outline-primary mb-3"
              @click="genSecretToken"
            >
              Gen Secret
            </button>
            <p v-if="secretToken" class="text-highlight">{{ secretToken }}</p>
          </div>
        </template>
        <div class="my-3">
          <button
            v-for="btn in seeks"
            :key="`back-${btn.text}`"
            type="button"
            class="btn-accent"
            @click="seekVideo('back', btn.value)"
          >
            &lt; {{ btn.text }}
          </button>
        </div>
        <div class="my-3">
          <button
            v-for="btn in seeks"
            :key="`forward-${btn.text}`"
            type="button"
            class="btn-hightlight"
            @click="seekVideo('forward', btn.value)"
          >
            {{ btn.text }} &gt;
          </button>
        </div>
        <div class="my-3">
          <button
            type="button"
            class="btn-accent"
            @click="sendSimpleCmd('volume-down')"
          >
            Vol DOWN
          </button>
          <button
            type="button"
            class="btn-hightlight"
            @click="sendSimpleCmd('volume-up')"
          >
            Vol UP
          </button>
        </div>
        <div class="my-3">
          <button
            v-for="l in layouts"
            :key="`layout-${l.value}`"
            type="button"
            :class="{'btn-primary': l.value === layout}"
            @click="setLayout(l.value)"
          >
            {{ l.text }}
          </button>
        </div>
      </div>
      <div class="ios-note text-accent mb-3">
        On iOS user may need to play the View first. This is because iOS block
        content auto-play to protect users from abusive ads.
      </div>
      <div class="ios-note text-accent mb-3">
        On iOS devices, the audio level is always under the user’s physical
        control. The volume property is not settable.
      </div>
    </div>
  </client-only>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';

const second = 1;
const minute = 60 * second;

export default Vue.extend({
  data() {
    return {
      ytStatus: '',
      ytVolume: '',
      videoID: '',
      inputID: '',
      embed: '',
      clip: '',
      secretToken: '',
      seeks: [
        {text: '10m', value: 10 * minute},
        {text: '5m', value: 5 * minute},
        {text: '1m', value: 1 * minute},
        {text: '30s', value: 30 * second},
        {text: '10s', value: 10 * second},
      ],
      layout: '',
      layouts: [
        {text: 'Blocks', value: 'layout-1'},
        {text: 'Fullscreen', value: 'layout-2'},
      ],
    };
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
    ytImgSrc() {
      if (!this.videoID) return '';
      return `https://img.youtube.com/vi/${this.videoID}/0.jpg`;
    },
  },
  mounted() {
    this.videoIDRef = this.makeDbRef('youtube/videoID');
    this.ytCommandRef = this.makeDbRef('youtube/command');
    this.ytStatusRef = this.makeDbRef('youtube/status');
    this.ytVolmeRef = this.makeDbRef('youtube/volume');
    this.layoutRef = this.makeDbRef('layout');
    this.embedRef = this.makeDbRef('embed');
    this.secretRef = this.makeDbRef('secret');
    this.clipRef = this.makeDbRef('clip');

    this.videoIDRef.on('value', this.handleVideoID);
    this.ytStatusRef.on('value', this.handleYTStatus);
    this.ytVolmeRef.on('value', this.handleYTVolume);
    this.layoutRef.on('value', this.handleLayout);
    this.clipRef.on('value', this.handleClip);
  },
  beforeDestroy() {
    this.videoIDRef.off('value', this.handleVideoID);
    this.ytStatusRef.off('value', this.handleYTStatus);
    this.ytVolmeRef.off('value', this.handleYTVolume);
    this.layoutRef.off('value', this.handleLayout);
    this.clipRef.off('value', this.handleClip);
  },
  methods: {
    makeDbRef(refStr) {
      const uid = (this.authUser && this.authUser.uid) || 'test';
      return this.$fireDb.ref(`${uid}/${refStr}`);
    },
    getYoutubeID(str) {
      // eslint-disable-next-line
      const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
      const regResult = ytRegex.exec(str);
      if (!regResult) return '';
      return regResult[1];
    },
    handleVideoID(snapshot) {
      this.videoID = snapshot.val();
    },
    handleYTStatus(snapshot) {
      this.ytStatus = snapshot.val();
    },
    handleYTVolume(snapshot) {
      this.ytVolume = snapshot.val();
    },
    handleLayout(snapshot) {
      this.layout = snapshot.val();
    },
    handleClip(snapshot) {
      this.clip = snapshot.val();
    },
    updateYoutubeID() {
      this.videoID = this.getYoutubeID(this.inputID);
      if (!this.videoID) {
        // TODO: Handle show error
        return;
      }
      this.videoIDRef.set(this.videoID);
    },
    async youtubeClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        this.inputID = text;
      } catch (err) {
        alert('Please allow access to clipboard');
      }
    },
    updateEmbed() {
      this.embedRef.set(this.embed);
    },
    async embedClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        this.embed = text;
      } catch (err) {
        alert('Please allow access to clipboard');
      }
    },
    updateClip() {
      this.clipRef.set(this.clip);
    },
    sendSimpleCmd(cmd) {
      this.ytCommandRef.set(cmd);
    },
    seekVideo(mode, dur) {
      this.ytCommandRef.set(`${mode}-${dur}`);
    },
    setLayout(layout) {
      this.layoutRef.set(layout);
    },
    genSecretToken() {
      this.secretToken = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
      this.secretRef.set(this.secretToken);
      setTimeout(() => {
        this.secretToken = '';
      }, 5000);
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  max-width: 550px;
  margin: auto;
  display: block;
  text-align: center;
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
  }
  .controller {
    padding: 1rem;
    .yt-cover {
      position: relative;
      max-width: 300px;
      margin: auto;
      .play-pause-status {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        color: white;
        font-size: 0.8rem;
      }
      .volume {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        color: white;
        font-size: 0.8rem;
      }
      img {
        width: 100%;
      }
    }
    .input-group {
      display: flex;
      input {
        padding: 0.5em 0.7em;
        width: 100%;
      }
      .input-group-append {
        display: flex;
      }
    }
  }
  .ios-note {
    font-size: 0.7rem;
  }
}
</style>
