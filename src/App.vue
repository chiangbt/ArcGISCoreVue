<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <MainLayout/>
    </div>
  </a-config-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import MainLayout from './components/MainLayout.vue'

export default {
  name: 'app',
  data() {
    return {
      zh_CN
    }
  },
  components: {
    MainLayout
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
</style>
