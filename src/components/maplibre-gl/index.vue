<template>
    <main>
        <div
            id="map"
            style="width: 100%; height: 100vh"></div>
        <div style="position: absolute; top: 10px; left: 10px; z-index: 1">
            <select
                v-model="currentStyle"
                @change="changeMapStyle">
                <option value="vec">矢量地图</option>
                <option value="img">影像地图</option>
                <option value="ter">地形地图</option>
            </select>
        </div>
        <div class="fps">FPS：{{ fps }}</div>
    </main>
</template>

<script>
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
export default {
    name: "PureMapLibreDemo",
    data() {
        return {
            map: null,
            baseConfig: {
                // center: [114.305, 30.5928], // 武汉市中心
                center: [114.38289848809904, 30.603658880826956], // 仁和路
                zoom: 6,
                // bounds: [
                //   [113.8, 30.2],
                //   [114.6, 30.9],
                // ], // 武汉市大致范围
                bounds: [
                    [114.3760442254665, 30.60883451645401],
                    [114.38897621261208, 30.597845743044175],
                ], // 仁和路大致范围
            },
            baseUrl: {
                vec: "./gis-ae/tdt-map/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=6cd9a2cd6399e2f545b4afacc6177fda",
                img: "./gis-ae/tdt-map/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=6cd9a2cd6399e2f545b4afacc6177fda",
                ter: "./gis-ae/tdt-map/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=6cd9a2cd6399e2f545b4afacc6177fda",
                cva: "./gis-ae/tdt-map/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=6cd9a2cd6399e2f545b4afacc6177fda",
            },
            currentStyle: "vec",
            fps: 0,
        };
    },
    watch: {},
    mounted() {
        this.initMap();
    },
    methods: {
        initMap() {
            this.map = new maplibregl.Map({
                container: "map",
                style: this.getStyle(),
                center: this.baseConfig.center, // 武汉市中心
                zoom: this.baseConfig.zoom,
                minZoom: 3,
                renderWorldCopies: false,
            });
            this.map.on("load", async () => {
                this.getFps();
                this.fitMapToBounds();
                this.addControls();
                this.addDrawControls();
                this.$emit("ready", this.map);
            });
        },
        getFps() {
            let lastFrameTime = performance.now();
            let currentFPS = 0;
            let timer = null;

            let animate = () => {
                const currentTime = performance.now();
                const deltaTime = currentTime - lastFrameTime;

                currentFPS = 1000 / deltaTime;

                lastFrameTime = currentTime;
                requestAnimationFrame(animate);

                if (timer) {
                    return;
                }
                timer = setTimeout(() => {
                    this.fps = currentFPS.toFixed(2);
                    timer = null;
                }, 200);
            };
            animate();
        },
        changeMapStyle() {
            this.map.setStyle(this.getStyle());
        },
        getStyle() {
            return {
                version: 8,
                glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
                sources: {
                    base: {
                        type: "raster",
                        tiles: [this.baseUrl[this.currentStyle]],
                        tileSize: 256,
                    },
                    label: {
                        type: "raster",
                        tiles: [this.baseUrl.cva],
                        tileSize: 256,
                    },
                },
                layers: [
                    {
                        id: "base",
                        type: "raster",
                        source: "base",
                    },
                    {
                        id: "label",
                        type: "raster",
                        source: "label",
                    },
                ],
            };
        },
        fitMapToBounds() {
            const padding = new maplibregl.EdgeInsets(50, 50, 50, 50); // 上、右、下、左
            this.map.fitBounds(this.baseConfig.bounds, {
                padding: padding,
                animate: false,
            });
        },
        addControls() {
            this.map.addControl(new maplibregl.NavigationControl(), "top-right");
            this.map.addControl(new maplibregl.FullscreenControl(), "top-right");
            this.map.addControl(new maplibregl.GeolocateControl(), "top-right");
            this.map.addControl(new maplibregl.ScaleControl(), "bottom-left");
        },
        addDrawControls() {
            const draw = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    point: true,
                    line_string: true,
                    polygon: true,
                    trash: true,
                },
                styles: [
                    // 默认填充样式
                    {
                        id: "gl-draw-polygon-fill",
                        type: "fill",
                        filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                        paint: {
                            "fill-color": "#00bcd4",
                            "fill-opacity": 0.3,
                        },
                    },
                    // 填充轮廓样式
                    {
                        id: "gl-draw-polygon-stroke",
                        type: "line",
                        filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                        paint: {
                            "line-color": "#00bcd4",
                            "line-width": 2,
                        },
                    },
                    // 绘制时的线样式
                    {
                        id: "gl-draw-line",
                        type: "line",
                        filter: ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
                        paint: {
                            "line-color": "#ff9800",
                            "line-width": 2,
                        },
                    },
                    // 绘制点的样式
                    {
                        id: "gl-draw-point",
                        type: "circle",
                        filter: ["all", ["==", "$type", "Point"], ["!=", "mode", "static"]],
                        paint: {
                            "circle-radius": 5,
                            "circle-color": "#f44336",
                        },
                    },
                    // 鼠标悬停样式
                    {
                        id: "gl-draw-polygon-hover",
                        type: "fill",
                        filter: ["all", ["==", "$type", "Polygon"], ["==", "active", "false"], ["==", "user_hover", true]],
                        paint: {
                            "fill-color": "#00bcd4",
                            "fill-opacity": 0.5,
                        },
                    },
                    // 选中状态样式
                    {
                        id: "gl-draw-polygon-active",
                        type: "line",
                        filter: ["all", ["==", "$type", "Polygon"], ["==", "active", "true"]],
                        paint: {
                            "line-color": "#2196f3",
                            "line-width": 3,
                        },
                    },
                    // 选中的线样式
                    {
                        id: "gl-draw-line-active",
                        type: "line",
                        filter: ["all", ["==", "$type", "LineString"], ["==", "active", "true"]],
                        paint: {
                            "line-color": "#2196f3",
                            "line-width": 3,
                        },
                    },
                    // 选中的点样式
                    {
                        id: "gl-draw-point-active",
                        type: "circle",
                        filter: ["all", ["==", "$type", "Point"], ["==", "active", "true"]],
                        paint: {
                            "circle-radius": 6,
                            "circle-color": "#2196f3",
                        },
                    },
                ],
            });
            this.map.addControl(draw, "top-right");
            const buttons = document.querySelectorAll(".mapbox-gl-draw_ctrl-draw-btn");

            buttons.forEach(button => {
                const title = button.getAttribute("title");
                if (title === "LineString tool (l)") button.setAttribute("title", "线工具");
                if (title === "Polygon tool (p)") button.setAttribute("title", "多边形工具");
                if (title === "Marker tool (m)") button.setAttribute("title", "标记工具");
                if (title === "Delete") button.setAttribute("title", "删除");
            });
            this.map.on("draw.create", e => {
                const drawType = e.features[0].geometry.type;
                const featureId = e.features[0].id;
                draw.setFeatureProperty(featureId, "editable", false); // 标记为不可编辑
                // draw.changeMode('static');  // 切换到静态模式
                if (drawType === "Polygon") {
                    this.renderRandomMarker(e.features[0]);
                }
            });
            this.map.on("draw.delete", e => {
                const drawType = e.features[0].geometry.type;
                if (drawType === "Polygon") {
                    const uid = e.features[0].id.slice(0, 4);
                    this.map.removeLayer(`random-points-${uid}`);
                    this.map.removeSource(`random-points-${uid}`);
                }
            });
        },
    },
};
</script>

<style lang="scss">
.fps {
    position: absolute;
    right: 12px;
    bottom: 40px;
    background-color: rgb(255, 255, 255);
    padding: 4px 6px;
    border-radius: 24px;
    font-size: 12px;
}

.mapboxgl-ctrl-group {
    float: right;
    margin: 10px 10px 0 0;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    clear: both;
    pointer-events: auto;
    transform: translate(0);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .mapbox-gl-draw_ctrl-draw-btn {
        border: none;
        cursor: pointer;
        border-bottom: 1px solid #ddd;
        background-color: #fff;
        background-size: 24px;

        &:last-child {
            border-bottom: none;
        }
    }
}
</style>
