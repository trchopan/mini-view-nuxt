<template>
  <client-only>
    <div class="container">
      <div class="content-wrapper">
        <div class="content">
          <h1 class="my-3">Mini View</h1>
          <h6 class="my-3">by Chop Tr</h6>
          <div class="intro my-3">
            <p>
              I have a spare tablet so I decided to build a View - Controller
              system that I can play youtube video, show a clock, embed some
              string like cpu status, etc.
            </p>
            <p>Enjoy!</p>
          </div>
          <div>
            <div v-if="authUser">
              <h3>Welcome, {{ authUser.email }}</h3>
            </div>
            <div v-else>
              <h3>Please login</h3>
            </div>
          </div>
          <div class="my-5">
            <button
              v-if="!authUser"
              type="button"
              class="btn-primary"
              @click="signIn"
            >
              Sign In
            </button>
            <button v-else type="button" class="btn-secondary" @click="signOut">
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
  max-width: 500px;
  padding: 0.5rem;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  .content-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .content {
      .intro > p {
        text-align: left;
        margin-bottom: 1rem;
        line-height: 1.5rem;
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
  }
  .version {
    flex: none;
  }
}
</style>
