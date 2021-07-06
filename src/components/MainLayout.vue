<template>
  <a-layout id="components-layout-demo-custom-trigger" style="height: 100%;">
    <Sidebar></Sidebar>
    <a-layout>
      <Header></Header>
      <a-layout>
        <a-layout-sider :style="{ margin: '12px', padding: '12px', background: '#fff', minHeight: '280px' }">
          <keep-alive>
            <router-view/>
          </keep-alive>
        </a-layout-sider>
        <MainPanel></MainPanel>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import Header from './layout/Header.vue';
import Sidebar from './layout/Sidebar.vue';
import MainPanel from './layout/MainPanel.vue';

export default {
  name: 'MainLayout',
  components: {
    Header,
    Sidebar,
    MainPanel
  }
}
</script>

<style scoped>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
