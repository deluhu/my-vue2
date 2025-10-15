<template>
    <div class="maplibre-gl">
        <div
            class="map-container"
            id="map-el"></div>
        <div class="layer-select">
            <select
                v-model="currentStyle"
                @change="changeMapStyle">
                <option value="vec">矢量地图</option>
                <option value="img">影像地图</option>
                <option value="ter">地形地图</option>
            </select>
        </div>
    </div>
</template>

<script>
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
export default {
    name: "baseMap-test",
    data() {
        return {
            map: null,
            baseConfig: {
                center: [114.305, 30.5928], // 武汉市中心
                zoom: 6,
                bounds: [
                    [113.8, 30.2],
                    [114.6, 30.9],
                ], // 武汉市大致范围
            },
            baseUrl: {
                vec: "./gis-ae/tdt-map/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=6cd9a2cd6399e2f545b4afacc6177fda",
                img: "./gis-ae/tdt-map/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=6cd9a2cd6399e2f545b4afacc6177fda",
                ter: "./gis-ae/tdt-map/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=6cd9a2cd6399e2f545b4afacc6177fda",
            },
            baseCva:
                "./gis-ae/tdt-map/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=6cd9a2cd6399e2f545b4afacc6177fda",
            currentStyle: "vec",
        };
    },
    watch: {},
    mounted() {
        this.initMap();
    },
    methods: {
        initMap() {
            this.map = new maplibregl.Map({
                container: "map-el",
                style: this.getStyle(),
                center: this.baseConfig.center, // 武汉市中心
                zoom: this.baseConfig.zoom,
                minZoom: 3,
                renderWorldCopies: false,
            });
            this.map.on("load", async () => {
                this.fitMapToBounds();
            });
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
                        tiles: [this.baseCva],
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
        fitMapToBounds(bounds) {
            const padding = new maplibregl.EdgeInsets(50, 50, 50, 50); // 上、右、下、左
            const mapBounds = bounds || this.baseConfig.bounds;
            this.map.fitBounds(mapBounds, {
                padding: padding,
                animate: false,
            });
        },
        changeMapStyle() {
            this.map.setStyle(this.getStyle());
        },
    },
};
</script>

<style lang="scss">
.maplibre-gl {
    width: 100%;
    height: 100%;

    .map-container {
        width: 100%;
        height: 100%;
    }

    .layer-select {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1;
    }
}
</style>
