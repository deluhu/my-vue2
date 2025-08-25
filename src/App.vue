<template>
    <div id="app">
        <section class="hdl-menu">
            <a-menu
                :default-selected-keys="current"
                :open-keys.sync="openKeys"
                mode="inline">
                <a-sub-menu
                    v-for="item in menuConfig"
                    :key="item.key">
                    <span slot="title">
                        <a-icon :type="item.icon" />
                        <span>{{ item.name }}</span>
                    </span>
                    <a-menu-item
                        v-for="subItem in item.children"
                        @click="menuClick(subItem)"
                        :key="subItem.key">
                        {{ subItem.name }}
                    </a-menu-item>
                </a-sub-menu>
            </a-menu>
        </section>
        <section class="hdl-view">
            <router-view></router-view>
        </section>
    </div>
</template>
<script>
export default {
    data() {
        return {
            current: ["maplibre-gl"],
            openKeys: ["map"],
            menuConfig: [
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
                    ],
                },
            ],
        };
    },
    watch: {},
    methods: {
        menuClick(item) {
            console.log("click", item);
            if (this.$route.path === item.url) return;
            this.$router.push({ path: item.url });
        },
    },
};
</script>

<style lang="scss">
body {
    margin: 0;
    padding: 0;
}

#app {
    width: 100%;
    height: 100%;
    display: flex;
}

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
