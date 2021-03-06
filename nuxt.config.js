import firebaseConf from './firebase-config.js';
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
  css: ['normalize.css/normalize.css', '~/assets/styles.scss'],
  plugins: [{src: '~/plugins/youtube.js', mode: 'client'}],
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
