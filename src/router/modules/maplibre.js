const routes = [
    {
        path: "/maplibre-gl",
        name: "maplibre-gl",
        component: resolve => require(["@views/maplibre-gl/index.vue"], resolve),
    },
    {
        path: "/hydrodynamic-model",
        name: "hydrodynamic-model",
        component: resolve => require(["@views/hydrodynamic-model/index.vue"], resolve),
    },
    {
        path: "/baseMap-test",
        name: "baseMap-test",
        component: resolve => require(["@views/baseMap-test/index.vue"], resolve),
    },
];

export default routes;
