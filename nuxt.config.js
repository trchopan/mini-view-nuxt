import firebaseConf from 'firebase-conf.js';
import {title, meta, link, script} from './headers.js';

export default {
  mode: 'universal',
  target: 'static',
  head: {
    title,
    meta,
    link,
    script,
  },
  css: ['~/assets/styles.scss'],
  plugins: ['~/plugins/youtube.js'],
  components: true,
  buildModules: ['@nuxtjs/eslint-module'],
  modules: ['@nuxtjs/firebase'],
  firebase: {
    config: firebaseConf,
    onFirebaseHosting: true,
    services: {
      auth: {
        initialize: {
          onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION',
        },
      },
      realtimeDb: true,
    },
  },
  axios: {},
  build: {},
};
