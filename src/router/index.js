import Vue from 'vue';
import VueRouter from 'vue-router';

import BaseLayer from './../components/panel/BaseLayer.vue';
import Search from './../components/panel/Search.vue';
import Analyst from './../components/panel/Analyst.vue';
import About from './../components/panel/About.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'BaseLayer',
    component: BaseLayer,
    meta:{ keepAlive: true} // BaseLayer组件在路由切换时不销毁，保证checkbox不会重置
  },{
    path: '/search',
    name: 'Search',
    component: Search
  },{
    path: '/analyst',
    name: 'Analyst',
    component: Analyst
  },{
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;