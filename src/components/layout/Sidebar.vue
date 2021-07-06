<template>
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible collapsedWidth='40px' >
        <router-link :to="'/'"><font-awesome-icon icon="globe-asia" style="fontSize: 26px; color:white; margin-top:18px; margin-bottom:16px;"/></router-link>
        <a-menu theme="dark" mode="inline" 
            :selectedKeys="[this.$route.path]">
            <a-menu-item :key="'/'">
                <a-icon type="slack" />
                <router-link :to="'/'">基础图层</router-link>
            </a-menu-item>
            <a-menu-item :key="'/search'">
                <a-icon type="search" />
                <router-link :to="'/search'">查询</router-link>
            </a-menu-item>
            <a-menu-item :key="'/analyst'">
                <a-icon type="deployment-unit" />
                <router-link :to="'/analyst'">分析</router-link>
            </a-menu-item>
            <a-menu-item :key="'/about'">
                <a-icon type="info-circle" />
                <router-link :to="'/about'">关于</router-link>
            </a-menu-item>
        </a-menu>
    </a-layout-sider>
</template>

<script>
export default {
    name: 'Sidebar',
    data() {
        return {
            collapsed: true
        };
    }
}
</script>

<style scoped>
.ant-menu-inline-collapsed > .ant-menu-item, .ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-item, .ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-submenu > .ant-menu-submenu-title, .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
  left: 0;
  padding: 0 0px !important;
  text-overflow: clip;
}

.ant-menu-inline-collapsed {
  width: 40px;
}
</style>