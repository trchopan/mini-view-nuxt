export const state = () => ({
  authUser: null,
});

export const actions = {};

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, {authUser, claims}) => {
    if (!authUser) {
      // eslint-disable-next-line
      console.log('No Auth');
      state.authUser = null;
    } else {
      // eslint-disable-next-line
      console.log('Auth', authUser);
      state.authUser = {
        email: authUser.email,
        uid: authUser.uid,
      };
    }
  },
};
