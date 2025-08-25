<template>
    <maplibreGl @ready="mapReady"> </maplibreGl>
     <!-- <span>222</span> -->
</template>

<script>
import maplibreGl from "@cmp/maplibre-gl";
export default {
    name: "hydrodynamic-model",
    components: {
        maplibreGl,
    },
    data() {
        return {
            map: null,
        };
    },
    watch: {},
    mounted() {},
    methods: {
        mapReady(map) {
            this.map = map;
        },
    },
};
</script>

<style lang="scss"></style>
