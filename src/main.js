import Vue from "vue";
import App from "@/App.vue";

import axios from "axios";
Vue.prototype.$axios = axios;

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

Vue.use(Antd);
Vue.prototype.$message = Antd.message;

import "@style/common.scss";
import "@style/global.scss";

Vue.config.productionTip = false;

import router from "@/router/index.js";

new Vue({
    router,
    render: h => h(App),
}).$mount("#app");
