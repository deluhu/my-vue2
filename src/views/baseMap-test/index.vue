<template>
    <div class="map-wrapper">
        <div
            id="map"
            class="map-container"></div>
    </div>
</template>

<script>
import maplibregl from "maplibre-gl";
import CryptoJS from "crypto-js";

// import { layerRequests } from "./config";
import { layerRequests } from "./config-error";

export default {
    name: "MapView",
    data() {
        return {
            map: null,
            currentRequest: layerRequests[8],
            token: "",
        };
    },
    computed: {
        baseUrl() {
            return this.currentRequest.url;
        },
        accessKey() {
            return this.currentRequest.accessKey;
        },
        secretKey() {
            return this.currentRequest.secretKey;
        },
    },
    async mounted() {
        try {
            // 1. 获取 token
            this.token = await this.getToken(this.accessKey, this.secretKey);
            console.log("✅ Token 获取成功:", this.token);

            await this.sendNormalRequester();
            // await this.GetCapabilities();
            await this.GetPJson();

            // 2. 初始化地图
            this.initMap();

            //点
            const layerData = await this.queryLayer();
            this.addLayerToMap(layerData.data);

            //线
            // const layerData = await this.queryLineLayer();
            // this.addLineLayerToMap(layerData.data);

            //面
            // const layerData = await this.queryGeoJsonLayer();
            // this.addPolygonLayerToMap(layerData.data);
        } catch (err) {
            console.error("❌ 初始化失败:", err);
        }
    },
    methods: {
        initMap() {
            const typeName = "jiangnan%3A市政已勘管线";
            this.map = new maplibregl.Map({
                container: "map",
                style: {
                    version: 8,
                    sources: {
                        baseMap: {
                            type: "raster",
                            tiles: [
                                "/gis-ae/tdt-map/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=6cd9a2cd6399e2f545b4afacc6177fda",
                            ],
                            tileSize: 256,
                        },
                        base: {
                            type: "raster",
                            tiles: [
                                // `${this.baseUrl}?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&STYLES&LAYERS=0.0&SRS=EPSG%3A3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}`,
                                // `${this.baseUrl}?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&STYLES&LAYERS=0.1&SRS=EPSG%3A3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}`,
                                // `${this.baseUrl}/0/tile/{z}/{y}/{x}`,
                                `${this.baseUrl}/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&format=png&transparent=true&f=image`,
                            ],
                            tileSize: 256,
                        },
                        basePipe: {
                            type: "raster",
                            tiles: [
                                `/gis/service/ows?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&STYLES&LAYERS=${typeName}&SRS=EPSG%3A3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}`,
                            ],
                            tileSize: 256,
                        },
                    },
                    layers: [
                        // {
                        //     id: "baseMap-layer",
                        //     type: "raster",
                        //     source: "baseMap",
                        // },
                        {
                            id: "base-layer",
                            type: "raster",
                            source: "base",
                        },
                        {
                            id: "basePipe-layer",
                            type: "raster",
                            source: "basePipe",
                        },
                    ],
                },
                center: [106.530635, 29.544606],
                zoom: 12,
            });

            this.map.on("load", () => {
                console.log("✅ 地图加载完成");
                this.map.on("click", e => {
                    const lng = e.lngLat.lng.toFixed(6);
                    const lat = e.lngLat.lat.toFixed(6);
                    console.log([lng, lat]);
                });
            });
        },
        async queryLayer() {
            const res = await this.$axios.get(`${this.baseUrl}/0/query`, {
                headers: {
                    "X-ACCESS-TOKEN": this.token,
                    "Content-Type": "application/json",
                },
                params: {
                    where: "1=1",
                    outFields: "*",
                    f: "JSON",
                    // returnGeometry: true,
                    // resultRecordCount: 10,
                    // resultOffset: 0,
                },
            });
            return res;
        },
        addLayerToMap(data) {
            const geoJson = {
                type: "FeatureCollection",
                features: data.features.map(i => {
                    return {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [i.geometry.x, i.geometry.y],
                        },
                    };
                }),
            };
            console.log("🚀 ~ geoJson:", geoJson);
            this.map.addSource("schools", {
                type: "geojson",
                data: geoJson,
            });
            this.map.addLayer({
                id: "schools-points",
                type: "circle",
                source: "schools",
                paint: {
                    "circle-color": "#009924", // 绿色
                    "circle-radius": 5,
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#000000",
                    "circle-opacity": 0.8,
                },
            });
        },
        async queryLineLayer() {
            const res = await this.$axios.get(`${this.baseUrl}/query`, {
                headers: {
                    "X-ACCESS-TOKEN": this.token,
                    "Content-Type": "application/json",
                },
                params: {
                    where: "1=1",
                    outFields: "*",
                    f: "json",
                    returnGeometry: true,
                    // resultRecordCount: 10,
                    // resultOffset: 0,
                },
            });
            return res;
        },
        addLineLayerToMap(data) {
            const geoJson = {
                type: "FeatureCollection",
                features: data.features,
            };
            console.log("🚀 ~ geoJson:", geoJson);
            this.map.addSource("landPlanning", {
                type: "geojson",
                data: geoJson,
            });
            this.map.addLayer({
                id: "polylines",
                type: "line",
                source: "my-polylines",
                paint: {
                    "line-color": "#ff0000", // 红色
                    "line-width": 4, // 线宽
                    "line-opacity": 0.8, // 透明度
                },
            });
        },
        async queryGeoJsonLayer() {
            const res = await this.$axios.get(`${this.baseUrl}/0/query`, {
                headers: {
                    "X-ACCESS-TOKEN": this.token,
                    "Content-Type": "application/json",
                },
                params: {
                    where: "1=1",
                    outFields: "*",
                    f: "json",
                    // returnGeometry: true,
                    // resultRecordCount: 10,
                    // resultOffset: 0,
                },
            });
            return res;
        },
        addPolygonLayerToMap(data) {
            console.log("🚀 ~ data:", data);
            const geoJson = {
                type: "FeatureCollection",
                features: data.features,
            };
            console.log("🚀 ~ geoJson:", geoJson);
            this.map.addSource("landPlanning", {
                type: "geojson",
                data: geoJson,
            });
            this.map.addLayer({
                id: "landPolygon",
                type: "fill",
                source: "landPlanning",
                paint: {
                    "fill-color": "#ff0000",
                    "fill-opacity": 0.8,
                    "fill-outline-color": "#6E6E6E",
                },
            });
        },
        async sendNormalRequester() {
            const res = await this.$axios.get(`${this.baseUrl}`, {
                headers: {
                    "X-ACCESS-TOKEN": this.token,
                    "Content-Type": "application/json",
                },
            });
            // const res = await this.$axios.post(`${this.baseUrl}`, {},{
            //     headers: {
            //         "X-ACCESS-TOKEN": this.token,
            //         "Content-Type": "application/json",
            //     },
            // });
            return res;
        },
        async getToken(accessKey, secretKey) {
            const timestamp = Math.floor(Date.now() / 1000);
            const params = { access_key: accessKey, timestamp };
            const signString = Object.keys(params)
                .sort()
                .map(k => `${k}=${params[k]}`)
                .join("&");
            const signature = CryptoJS.HmacSHA256(signString, secretKey).toString();

            try {
                const res = await this.$axios.get("/apisix/token", {
                    params: {
                        access_key: accessKey,
                        timestamp: timestamp,
                        signature: signature,
                    },
                });
                const data = res.data || {};
                if (!data.token) throw new Error("Token返回异常");
                return data.token;
            } catch (error) {
                console.error(error);
                return "";
            }
        },
        async GetCapabilities() {
            const res = await this.$axios.get(this.baseUrl, {
                headers: {
                    "X-ACCESS-TOKEN": this.token,
                    "Content-Type": "application/json",
                },
                params: {
                    SERVICE: "WMS",
                    REQUEST: "GetCapabilities",
                },
            });
            return res;
        },
        async GetPJson() {
            const res = await this.$axios.get(this.baseUrl, {
                headers: {
                    "X-ACCESS-TOKEN": this.token,
                    "Content-Type": "application/json",
                },
                params: {
                    f: "pjson",
                },
            });
            return res;
        },
    },
};
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 100vh;
}
</style>
