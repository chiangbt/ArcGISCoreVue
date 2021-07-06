<template>
    <div style="text-align:left;">
        <a-divider>业务数据</a-divider>
            <div class="left" id="left">
                选中图层 {{this.$store.state.currentBLayer ? this.$store.state.currentBLayer.name : '未选择'}}
                <a-tree 
                    :auto-expand-parent="autoExpandParent"
                    :tree-data="busTreeData"
                    @rightClick="onRightClick"
                />
                <v-contextmenu ref="contextmenu">
                    <v-contextmenu-item @click="addLayer"><a-icon type="plus-circle" />&nbsp;加载地图</v-contextmenu-item>
                    <v-contextmenu-item @click="zoomTo"><a-icon type="zoom-in" />&nbsp;数据定位</v-contextmenu-item>
                    <a-divider></a-divider>
                    <v-contextmenu-item @click="removeLayer"><a-icon type="minus-circle" />&nbsp;移除地图</v-contextmenu-item>
                </v-contextmenu>
            </div>
        <a-divider>基础底图</a-divider>
        <a-select :default-value="baseValue" @change="onChange" style="width:100%;">
            <a-select-option v-for="(item,index) in items" v-bind:key="index" :value="index">
                {{item.label}}
            </a-select-option>
        </a-select>
    </div>
</template>

<script>
// 进行图层加载和处理
import appconfig from './../../config/appconfig';
import Basemap from "@arcgis/core/Basemap";
import TileLayer from '@arcgis/core/layers/TileLayer';
import ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer';
import WMTSLayer from '@arcgis/core/layers/WMTSLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import SceneLayer from '@arcgis/core/layers/SceneLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import tencentLayer from './../esrilayers/tencentLayer';
import tmsLayer from './../esrilayers/tmsLayer';
import geoWMSLayer from './../esrilayers/geoWMSLayer';

export default {
    name: 'BaseLayer',
    data() {
        return {
            baseValue: appconfig.currentBaseLayerIndex,     // 当前使用的基础底图id
            basemapList: [],                                // 基础底图集合
            items: appconfig.baselayer.filter(item => {     // 基础底图配置对象集合（供Select使用）
                return item.valid === true
            }),
            businessLayer: [],                              // 业务图层集合
            busTreeData: appconfig.businessLayers,          // 业务图层树
            autoExpandParent: true,
            NodeTreeItem: null,
        };
    },
    async mounted() {
        // 基础图层加载
        this.items.forEach(item => {
            if(item.valid === true){
                // 天地图或多瓦片图层
                if(item.type === 'tianditu' || item.type === 'mwebtile'){
                    this.basemapList.push(new Basemap({
                        baseLayers:[new WebTileLayer({
                            urlTemplate: item.sublayer[0].url,
                            subDomains: item.subDomains
                        }), new WebTileLayer({
                            urlTemplate: item.sublayer[1].url,
                            subDomains: item.subDomains
                        })],
                        id:'影像地图'
                    }));
                }else if(item.type === 'agsvt'){
                    // Esri的矢量瓦片
                    this.basemapList.push(new Basemap({
                        id: item.label,
                        baseLayers:[new VectorTileLayer({
                            url: item.url
                        })]
                    }));
                }else if(item.type === 'webtile'){
                    // XYZ类型的瓦片地图（如OSM和高德）
                    this.basemapList.push(new Basemap({
                        id: item.label,
                        baseLayers:[new WebTileLayer({
                            urlTemplate: item.url,
                            subDomains: item.subDomains
                        })]
                    }));
                }else if(item.type === 'agstile'){
                    // ArcGIS 瓦片地图
                    this.basemapList.push(new Basemap({
                        id: item.label,
                        baseLayers:[new TileLayer({
                            url: item.url
                        })]
                    }));
                }else if(item.type === 'agsimagetile'){
                    // ArcGIS的影像瓦片地图
                    this.basemapList.push(new Basemap({
                        id: item.label,
                        baseLayers:[new ImageryTileLayer({
                            url: item.url,
                            blendMode: "destination-in"
                        })]
                    }));
                }else if(item.type === 'tencent'){
                    // 腾讯数据
                    this.basemapList.push(new Basemap({
                        id: item.label,
                        baseLayers:[new tencentLayer({
                            urlTemplate: item.url,
                            ten_type: item.ten_type,
                            subDomains: item.subDomains
                        })]
                    }));
                }
            }
        })
        this.$store.commit('addBasemapList', this.basemapList);

        // 业务图层解析
        appconfig.businessLayers.forEach(item => {
            item.children.forEach(it => {
                if(it.valid){   // 只有valid图层才添加
                    this.businessLayer.push({
                        id: it.key,
                        name: it.title,
                        type: it.type,
                        zoom: it.zoom,
                        center: it.center,
                        url: it.url,
                        activeLayer: it.activeLayer,
                        sublayers: it.sublayers,
                        opacity: it.opacity,
                        outFields: it.outFields,
                        popupTemplate: it.popupTemplate
                    });
                }
            })
        })
        this.$store.commit('addBusinessList', this.businessLayer);
    },
    methods: {
        // 切换底图
        onChange(e) {
            // 将Map的basemap切换为指定的BaseMap
            this.$store.state.mapView.map.basemap = this.$store.state.basemapList[e];
        },
        // 鼠标右键
        onRightClick ({ event, node }) {
            const answer = node._props.dataRef.anwer;
            if (answer) {
                this.$refs.contextmenu.hide()
                this.answer = answer;
                return;
            }
            this.NodeTreeItem = {
                id: node._props.eventKey,
                title: node._props.title,
                parentId: node._props.dataRef.parentId || null
            };
            const x =
                event.currentTarget.offsetLeft + event.currentTarget.clientWidth + 60;
            // 因为我放在页面上的box有滚动条，所以需要减掉该盒子的scrollTop
            const y = event.currentTarget.offsetTop - document.getElementById('left').scrollTop + 80;
            const postition = {
                top: y,
                left: x
            };
            if(node._props.eventKey.length !== 1){
                this.$refs.contextmenu.show(postition);
            }
            
        },
        // 添加业务图层
        addLayer(){
            // 如果地图中没有该图层则添加
            if(!this.$store.state.mapView.map.findLayerById(this.NodeTreeItem.id)){
                var that = this;
                // 寻找出当前图层
                var queryData = this.$store.state.businessList.filter(function(fp) {
                    return fp.id === that.NodeTreeItem.id
                })
                if(queryData.length === 0){
                    this.$message.error('当前图层不存在!');
                    return;
                }
                var curlayer = queryData[0];
                // 将图层添加到地图(map)中去
                // 所以添加到MapView.map 或 SceneView.map 均可以
                if(curlayer.type === 'agstile'){
                    this.$store.state.mapView.map.add(new TileLayer({
                        id: curlayer.id,
                        url: curlayer.url
                    }))
                }else if(curlayer.type === 'agsfeature'){
                    this.$store.state.mapView.map.add(new FeatureLayer({
                        id: curlayer.id,
                        url: curlayer.url,
                        outFields: curlayer.outFields,
                        popupTemplate: curlayer.popupTemplate
                    }))
                }else if(curlayer.type === 'tms'){
                    this.$store.state.mapView.map.add(new tmsLayer({
                        id: curlayer.id,
                        urlTemplate: curlayer.url
                    }))
                }else if(curlayer.type === 'wmts'){
                    this.$store.state.mapView.map.add(new WMTSLayer({
                        id: curlayer.id,
                        url: curlayer.url,
                        activeLayer: curlayer.activeLayer,
                        opacity: curlayer.opacity
                    }))
                }else if(curlayer.type === 'geowms'){
                    this.$store.state.mapView.map.add(new geoWMSLayer({
                        id: curlayer.id,
                        mapUrl: curlayer.url,
                        mapParameters: {
                            SERVICE: "WMS",
                            REQUEST: "GetMap",
                            FORMAT: "image/png",
                            TRANSPARENT: "TRUE",
                            STYLES: "",
                            VERSION: "1.3.0",
                            LAYERS: curlayer.sublayers,
                            WIDTH: "{width}",
                            HEIGHT: "{height}",
                            CRS: "EPSG:{wkid}",
                            BBOX: "{xmin},{ymin},{xmax},{ymax}"
                        },
                        title: "USA Satellite"
                    }))
                }else if(curlayer.type ==='wfs'){
                    this.$store.state.mapView.map.add(new GeoJSONLayer({
                        id: curlayer.id,
                        name: curlayer.name,
                        url: curlayer.url + '?service=WFS&version=1.0.0&request=GetFeature&typeName='+ curlayer.sublayers +'&maxFeatures=50&outputFormat=application%2Fjson',
                        popupTemplate: curlayer.popupTemplate
                    }));
                }else if(curlayer.type === 'scene'){
                    this.$store.state.sceneView.map.add(new SceneLayer({
                        id: curlayer.id,
                        name: curlayer.name,
                        url: curlayer.url
                    }));
                }
                // 设置为当前业务层
                this.$store.commit('setCurrentBLayer', curlayer);
                // 缩放到图层定义的center和zoom
                // 分情况判断
                if(this.$store.state.activeView === '2d'){
                    this.$store.state.mapView.goTo({center: curlayer.center, zoom: curlayer.zoom});
                }else{
                    this.$store.state.sceneView.goTo({center: curlayer.center, zoom: curlayer.zoom});
                }
            }else{
                console.log('图层已经添加');
                this.$message.error('当前图层已经添加至地图!');
            }
        },
        zoomTo(){
            // 如果地图中没有该图层则添加
            var that = this;
            if(this.$store.state.mapView.map.findLayerById(this.NodeTreeItem.id)){
                var queryData = this.$store.state.businessList.filter(function(fp) {
                    return fp.id === that.NodeTreeItem.id
                });
                if(queryData.length === 0){
                    this.$message.error('当前数据图层不存在!');
                    return;
                }
                var curlayer = queryData[0];
                // 设置为当前业务层
                this.$store.commit('setCurrentBLayer', curlayer);
                if(this.$store.state.activeView === '2d'){
                    this.$store.state.mapView.goTo({center: curlayer.center, zoom: curlayer.zoom});
                }else{
                    this.$store.state.sceneView.goTo({center: curlayer.center, zoom: curlayer.zoom});
                }
            }else{
                console.log('当前数据不存在地图之中');
                this.$message.error('当前数据不存在地图之中!');
            }
        },
        removeLayer(){
            // 清空当前业务图层
            this.curbusLayer = "null";
            this.$store.commit('setCurrentBLayer', null);
            if(this.$store.state.activeView === '2d'){
                if(this.$store.state.mapView.map.findLayerById(this.NodeTreeItem.id)){
                    // 移除当前图层
                    this.$store.state.mapView.map.remove(this.$store.state.mapView.map.findLayerById(this.NodeTreeItem.id));
                }
            }else{
                if(this.$store.state.sceneView.map.findLayerById(this.NodeTreeItem.id)){
                    // 移除当前图层
                    this.$store.state.sceneView.map.remove(this.$store.state.sceneView.map.findLayerById(this.NodeTreeItem.id));
                }
            }
        }
    },
}
</script>
<style scoped>
.ant-divider-horizontal{
    margin: 2px;
}
</style>