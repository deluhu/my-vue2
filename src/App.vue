<template>
    <div id="app">
        <section class="hdl-menu">
            <a-menu
                v-model="current"
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
                        @click="menuClick(subItem, item)"
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
            current: ["home"],
            openKeys: ["home"],
            menuConfig: [
                {
                    name: "首页",
                    icon: "global",
                    key: "home",
                    children: [
                        {
                            name: "首页",
                            key: "home",
                            url: "/home",
                        },
                    ],
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
                    ],
                },
            ],
        };
    },
    watch: {
        $route(to, from) {
            if (from.path === "/") {
                const currentUrl = to.path;
                this.matchMenu(currentUrl);
            }
        },
    },
    mounted() {
        const currentUrl = this.$route.path;
        if (currentUrl !== "/") {
            this.matchMenu(currentUrl);
        }
    },
    methods: {
        menuClick(subItem) {
            if (this.$route.path === subItem.url) return;
            this.$router.push({ path: subItem.url });
        },
        matchMenu(url) {
            this.menuConfig.forEach(item => {
                item.children.forEach(subItem => {
                    if (subItem.url === url) {
                        this.current = [subItem.key];
                        this.openKeys = [item.key];
                    }
                });
            });
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
