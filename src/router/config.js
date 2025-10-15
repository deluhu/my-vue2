const config = [
    {
        name: "首页",
        icon: "home",
        key: "home",
        url: "/home",
    },
    {
        name: "maplibre用例",
        icon: "global",
        key: "map",
        children: [
            {
                name: "大杂烩",
                key: "maplibre-gl",
                url: "/maplibre-gl",
            },
            {
                name: "水力模型",
                key: "hydrodynamic-model",
                url: "/hydrodynamic-model",
            },
            {
                name: "底图测试",
                key: "baseMap-test",
                url: "/baseMap-test",
            },
        ],
    },
];
export default config;
