<template>
  <client-only>
    <div class="container">
      <router-link tag="button" class="back-arrow" type="button" to="/">
        &lt;
      </router-link>
      <div class="greeting">
        <h1 v-if="authUser">
          Welcome, <span class="user-name">{{ authUser.email }}</span>
        </h1>
        <h1 v-else>
          You are controlling shared screen with other users. Please login in
          <router-link class="text-underline" to="/">Home screen</router-link>
          to have your own view.
        </h1>
      </div>
      <div class="controller">
        <div class="yt-cover">
          <img id="yt-cover" :src="ytImgSrc" alt="" />
        </div>
        <div class="input-group my-3">
          <input
            v-model="inputID"
            placeholder="Youtube link"
            class="form-control"
          />
          <div class="input-group-append">
            <button type="button" class="btn-primary" @click="updateYoutubeID">
              Update
            </button>
            <button type="button" @click="pasteClipboard">Clipboard</button>
          </div>
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
            &gt; {{ btn.text }}
          </button>
        </div>
        <div class="my-3">
          <button type="button" @click="setLayout('layout-1')">Layout 1</button>
          <button type="button" @click="setLayout('layout-2')">Layout 2</button>
        </div>
      </div>
      <div class="ios-note text-accent">
        On iOS user may need to be played by hand first in View. This is because
        iOS block content auto-play to protect users from abusive ads.
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
      videoID: '',
      inputID: '',
      seeks: [
        {text: '10m', value: 10 * minute},
        {text: '5m', value: 5 * minute},
        {text: '1m', value: 1 * minute},
        {text: '30s', value: 30 * second},
        {text: '10s', value: 10 * second},
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
    this.layoutRef = this.makeDbRef('layout');

    this.videoIDRef.on('value', this.handleVideoID);
  },
  beforeDestroy() {
    this.videoIDRef.off('value', this.handleVideoID);
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
    updateYoutubeID() {
      this.videoID = this.getYoutubeID(this.inputID);
      if (!this.videoID) {
        // TODO: Handle show error
        return;
      }
      this.videoIDRef.set(this.videoID);
    },
    async pasteClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        this.inputID = text;
      } catch (err) {
        alert('Please allow access to clipboard');
      }
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
    h1 {
      font-size: 1.5rem;
    }
  }
  .controller {
    padding: 1rem;
    .yt-cover {
      max-width: 300px;
      margin: auto;
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
