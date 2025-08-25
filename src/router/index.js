import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import maplibre from "./modules/maplibre.js";

// 直接路由
const router = [
    {
        path: "/",
        redirect: "/maplibre-gl",
    },
    ...maplibre,
];

export default new Router({
    mode: "hash",
    base: "/",
    routes: router,
});
