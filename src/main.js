import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import contentmenu from 'v-contextmenu'
import esriConfig from "@arcgis/core/config";
import './plugins/ant-design-vue.js';
import 'v-contextmenu/dist/index.css';
import '@arcgis/core/assets/esri/themes/light/main.css';
// 引入FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGlobeAsia } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// 设置esriConfig的静态文件目录及可信任的客户端地址
esriConfig.assetsPath = "./assets";
esriConfig.request.trustedServers.push("https://webmap.geoportal.cn");
esriConfig.request.trustedServers.push("http://127.0.0.1:5000");

Vue.use(contentmenu);
library.add(faGlobeAsia);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');