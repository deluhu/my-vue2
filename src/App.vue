<template>
    <div id="app">
        <section class="hdl-menu">
            <Menu></Menu>
        </section>
        <section class="hdl-view">
            <router-view></router-view>
        </section>
    </div>
</template>
<script>
import Menu from "@cmp/hdl-menu";
export default {
    components: { Menu },
    data() {
        return {};
    },
    watch: {},
    mounted() {},
    methods: {},
};
</script>

<style lang="scss">
.hdl-menu {
    width: 300px;
    height: 100%;
}

.hdl-view {
    width: calc(100% - 300px);
    height: 100%;
    position: relative;
}
</style>
