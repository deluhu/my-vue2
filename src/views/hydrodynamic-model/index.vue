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
                :interval-seconds="stepSec"
                @time-change="onTimeChange" />
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs";

import { startTs, endTs, stepSec, pipeData, pressureData, DMABounds } from "./mock.js";

import TimePlayer from "@cmp/time-slider";
import maplibreGl from "@cmp/maplibre-gl";

const GeoJson = {
    type: "FeatureCollection",
    features: pipeData.map(i => {
        return {
            type: "Feature",
            id: i.id,
            geometry: {
                type: "LineString",
                coordinates: i.coordinates,
            },
        };
    }),
};

export default {
    name: "hydrodynamic-model",
    components: {
        maplibreGl,
        TimePlayer,
    },
    data() {
        return {
            map: null,

            startTime: startTs,
            endTime: endTs,
            stepSec,

            timer: null,
        };
    },
    watch: {},
    mounted() {
        // console.log(pipeData, pressureData);
    },
    methods: {
        mapReady(map) {
            this.map = map;
            this.$refs.mapRef.fitMapToBounds(DMABounds);
            this.addLineSource();
            this.addLineLayer();
            this.updatePipeColors(this.startTime);
        },
        onTimeChange(timeStr) {
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                const timestamp = dayjs(timeStr).unix();
                this.updatePipeColors(timestamp);
                this.timer = null;
            }, 100);
        },
        addLineSource() {
            this.map.addSource("pipe-source", {
                type: "geojson",
                data: GeoJson,
            });
        },
        addLineLayer() {
            this.map.addLayer({
                id: "pipes-layer",
                type: "line",
                source: "pipe-source",
                paint: {
                    "line-width": 3,
                    "line-color": ["step", ["to-number", ["feature-state", "pressure"], 0], "#4791FF", 3, "#FDA154", 6, "#FC6B6B"],
                },
            });
        },
        updatePipeColors(timestamp) {
            const index = Math.floor((timestamp - startTs) / 60);
            for (const id in pressureData) {
                this.map.setFeatureState({ source: "pipe-source", id }, { pressure: pressureData[id][index].toFixed(2) });
            }
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
