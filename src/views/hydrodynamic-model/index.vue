<template>
    <div class="hydrodynamic-model w-100 h-100">
        <maplibreGl
            @ready="mapReady"
            ref="mapRef">
        </maplibreGl>
        <div class="time-player">
            <TimePlayer
                :startTime="startTime"
                :endTime="endTime"
                :interval-seconds="60"
                @time-change="onTimeChange" />
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs";
import TimePlayer from "@cmp/time-slider";
import maplibreGl from "@cmp/maplibre-gl";
import { pipeData, DMABounds } from "./mock.js";
export default {
    name: "hydrodynamic-model",
    components: {
        maplibreGl,
        TimePlayer,
    },
    data() {
        return {
            map: null,
            geojsonData: null,

            startTime: 0,
            endTime: 0,
        };
    },
    watch: {},
    mounted() {
        const timeRange = Object.keys(pipeData[0].pressure).map(Number);
        this.startTime = timeRange[0];
        this.endTime = timeRange[timeRange.length - 1];
    },
    methods: {
        mapReady(map) {
            this.map = map;
            this.$refs.mapRef.fitMapToBounds(DMABounds);
            this.getGeojsonData();
            this.addLineSource();
            this.addLineLayer();
            this.updatePipeColors(this.startTime);
        },
        onTimeChange(timeStr) {
            const timestamp = dayjs(timeStr).unix();
            this.updatePipeColors(timestamp);
        },
        getGeojsonData() {
            this.geojsonData = {
                type: "FeatureCollection",
                features: pipeData.map(i => {
                    return {
                        type: "Feature",
                        geometry: {
                            type: "LineString",
                            coordinates: i.coordinates,
                        },
                        properties: {
                            id: i.id,
                        },
                    };
                }),
            };
        },
        addLineSource() {
            this.map.addSource("pipe-source", {
                type: "geojson",
                data: this.geojsonData,
            });
        },
        addLineLayer() {
            this.map.addLayer({
                id: "pipes-layer",
                type: "line",
                source: "pipe-source",
                paint: {
                    "line-color": ["get", "$$colors"],
                    "line-width": 4,
                },
            });
        },
        getColorByPressure(value) {
            if (value < 0.3) return "#4791FF"; // 蓝
            if (value < 0.6) return "#FDA154"; // 橙
            return "#FC6B6B"; // 红
        },
        updatePipeColors(timestamp) {
            const newData = {
                type: "FeatureCollection",
                features: this.geojsonData.features.map((f, i) => {
                    const value = pipeData[i].pressure[timestamp];
                    return {
                        ...f,
                        properties: {
                            ...f.properties,
                            $$colors: this.getColorByPressure(value),
                        },
                    };
                }),
            };
            this.map.getSource("pipe-source").setData(newData);
        },
    },
};
</script>

<style lang="scss" scoped>
.hydrodynamic-model {
    position: relative;
    .time-player {
        width: 70%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 20px;
    }
}
</style>
