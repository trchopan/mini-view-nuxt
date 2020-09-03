<template>
  <client-only>
    <div class="container">
      <div class="content">
        <div>
          <h1 class="title my-3">Mini View</h1>
          <h6 class="subtitle my-3">by Chop Tr</h6>
          <div class="my-3">
            <div class="greeting">
              <div v-if="authUser">
                <h3>Welcome, {{ authUser.email }}</h3>
              </div>
              <div v-else>
                <h3>Please login</h3>
              </div>
            </div>
            <div class="sign-in-container my-5">
              <button
                v-if="!authUser"
                type="button"
                class="btn-primary"
                @click="signIn"
              >
                Sign In
              </button>
              <button
                v-else
                type="button"
                class="btn-secondary"
                @click="signOut"
              >
                Sign Out
              </button>
            </div>
            <div v-if="!authUser">
              <p>
                Or you can try below. But note that other user can interact with
                the view the same as you.
              </p>
            </div>
            <div class="navigator">
              <router-link to="/view">View</router-link>
              <router-link to="/controller">Controller</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="version">{{ version }}</div>
    </div>
  </client-only>
</template>

<script>
import Vue from 'vue';
import firebase from 'firebase/app';
import {mapState} from 'vuex';

export default Vue.extend({
  data() {
    return {version: '1.0.1'};
  },
  computed: {
    ...mapState({authUser: state => state.authUser}),
  },
  methods: {
    signIn() {
      const provider = new firebase.auth.GoogleAuthProvider();
      this.$fireAuth.signInWithPopup(provider);
    },
    signOut() {
      this.$fireAuth.signOut();
    },
  },
});
</script>

<style lang="scss">
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  .content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .sign-in-container {
    }
    .navigator {
      a {
        display: inline-block;
        border: solid 1px;
        border-radius: 2px;
        padding: 0.5rem;
        margin: 1rem;
      }
    }
  }
  .version {
    flex: none;
  }
}
</style>
