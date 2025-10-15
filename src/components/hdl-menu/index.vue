<template>
    <a-menu
        v-model="current"
        :open-keys.sync="openKeys"
        mode="inline">
        <template v-for="item in menuConfig">
            <a-sub-menu
                v-if="item.children"
                :key="item.key + '-submenu'">
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
            <a-menu-item
                v-else
                @click="menuClick(item)"
                :key="item.key">
                <a-icon :type="item.icon" />
                {{ item.name }}
            </a-menu-item>
        </template>
    </a-menu>
</template>
<script>
import menuConfig from "@/router/config.js";
export default {
    name: "hdl-menu",
    props: {
        //是否在点击时自动收起其他已展开的菜单
        autoCollapsed: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            current: ["home"],
            openKeys: ["home"],
            menuConfig: menuConfig,
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
        menuClick(subItem, item = null) {
            if (this.$route.path === subItem.url) return;
            this.$router.push({ path: subItem.url });
            if (this.autoCollapsed) {
                this.openKeys = item ? [item.key] : [];
            }
        },
        matchMenu(url) {
            const getMenu = (currentNode, parentKey = null) => {
                currentNode.forEach(item => {
                    if (item.children) {
                        getMenu(item.children, item.key);
                    } else {
                        if (item.url === url) {
                            this.current = [item.key];
                            this.openKeys = parentKey ? [parentKey] : [];
                        }
                    }
                });
            };
            getMenu(this.menuConfig);
        },
    },
};
</script>
