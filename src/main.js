import {
    createApp
} from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import mainCss from "./assets/css/main.css";
import jQuery from "jquery";
import axios from "axios";
import Toaster from "@incuca/vue3-toaster";

createApp(App).use(store).use(router).use(mainCss).use(jQuery).use(Toaster).mount("#app");

// axios.defaults.baseURL = 'https://tsback.smartpace.co.uk/api/v1';
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS,DELETE,PUT';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const isLoggedIn = () => {
    return localStorage.getItem('auth_user_token')
}
if (isLoggedIn()) {
    axios.defaults.headers["Authorization"] = "Bearer " + isLoggedIn();
    axios.get("/auth_user").then((res) => {
        store.dispatch("GetUser", res.data.users[0]);
    });
} else {
    localStorage.removeItem('auth_user_token');
    axios.defaults.headers["Authorization"] = "Bearer " + '';
}