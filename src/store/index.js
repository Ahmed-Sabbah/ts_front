import {
  createStore
} from "vuex";
import axios from "axios";

// Note: There are no data stored here, just the user_token is stored.

export default createStore({
  namespaced: true,
  state: {
    authenticated: false,
    auth_user: "",
    s_email: "",
  },
  getters: {
    authenticated(state) {
      return state.authenticated
    },
    auth_user(state) {
      return state.auth_user
    },
    s_email(state) {
      return state.s_email;
    }
  },
  mutations: {
    SET_AUTHENTICATED(state, token) {
      if (token != '') {
        state.authenticated = true;
        localStorage.setItem('auth_user_token', token);
        axios.defaults.headers["Authorization"] = "Bearer " + token;
      } else {
        state.authenticated = false;
        localStorage.removeItem('auth_user_token');
        axios.defaults.headers["Authorization"] = "Bearer " + '';
      }
    },
    SET_AUTH_USER(state, auth_user) {
      state.auth_user = auth_user;
    },
    SET_EMAIL(state, s_email) {
      state.s_email = s_email;
      localStorage.setItem('signup_user_email', s_email);
    }
  },
  actions: {
    Register({
      commit
    }, s_email) {
      commit("SET_EMAIL", s_email);
    },
    Login({
      commit
    }, user_token) {
      commit("SET_AUTHENTICATED", user_token);
    },
    Logout({
      commit
    }) {
      commit('SET_AUTHENTICATED', '');
    },
    GetUser({
      commit
    }, auth_user) {
      commit('SET_AUTH_USER', auth_user);
    },
  },
  modules: {},
});