<template>
    <div id="map" :style="{height: scrollerHeight}"></div>
</template>

<script>
import appconfig from './../../../config/appconfig';
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import SceneView from '@arcgis/core/views/SceneView';
import Home from '@arcgis/core/widgets/Home';
import Expand from '@arcgis/core/widgets/Expand';
import CoordinateConversion from '@arcgis/core/widgets/CoordinateConversion';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';
import Legend from '@arcgis/core/widgets/Legend';
import Measurement from '@arcgis/core/widgets/Measurement';
import LocateViewModel from '@arcgis/core/widgets/Locate/LocateViewModel';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import axios from 'axios';
import qs from 'qs';

export default {
    name: "MapObj",
    methods: {
        _createMapView () { 
            var map = new Map({
                ground: 'world-elevation',
                basemap: this.$store.state.basemapList[appconfig.currentBaseLayerIndex],
                layers: [this.$store.state.graphicsLayer]
            });
            const view = new MapView({
                container: this.$el,
                map: map,
                center: appconfig.view.center,
                zoom: appconfig.view.zoom,
                constraints:{
                maxZoom: appconfig.view.maxZoom,
                minZoom: appconfig.view.minZoom
                },
            });
            const sceneView = new SceneView({
                container: this.$el,
                map: map,
                center: appconfig.view.center,
                zoom: appconfig.view.zoom,
            });
            sceneView.container = null;
            this.$store.commit('setMapView', view);
            this.$store.commit('setSceneView', sceneView);

            // 定位对象
            this.$store.state.tools.locateTool = new LocateViewModel({
                view: view,
            });
            this.$store.state.tools.locate3dTool = new LocateViewModel({
                view: sceneView,
            });
            // Sketch对象
            this.$store.state.tools.sketchTool = new SketchViewModel({
                view: view,
                layer: this.$store.state.graphicsLayer,
                snappingOptions: {
                    enabled: true,
                    featureSources: [{ layer: this.$store.state.graphicsLayer }] 
                },
                polygonSymbol: {
                    type: "simple-fill",
                    color: [226, 119, 40, 0.7],
                    outline: {
                        color: "black",
                        width: 1
                    }
                },
                pointSymbol: {
                    type: "simple-marker",
                    style: 'circle',
                    size: "8px",
                    color: [226, 119, 40],  // Orange
                    outline: {
                        color: 'white', // White
                        width: 1
                    }
                },
                polylineSymbol: {
                    type: "simple-line",
                    color: [226, 119, 40], // Orange
                    width: 2
                }
            });
      
            // 根据配置文件设置Widget
            appconfig.widgets.forEach(widget => {
                switch(widget.type){
                    case "Home":
                        view.ui.add(new Home({
                            view: view,
                            id: widget.id
                        }), widget.position);
                        sceneView.ui.add(new Home({
                            view: sceneView,
                            id: widget.id + '_scene'
                        }), widget.position);
                        break;
                    case "Scalebar":
                        view.ui.add(new ScaleBar({
                            view: view,
                            unit: 'metric',
                            id: widget.id
                        }), widget.position);
                        break;
                    case "Coordinate":
                        view.ui.add(new CoordinateConversion({
                            view: view,
                            multipleConversions: false,
                            visibleElements: {
                                settingsButton: false,
                                captureButton: false
                            },
                            id: widget.id
                        }), widget.position);
                        sceneView.ui.add(new CoordinateConversion({
                            view: sceneView,
                            multipleConversions: false,
                            visibleElements: {
                                settingsButton: false,
                                captureButton: false
                            },
                            id: widget.id + '_scene'
                        }), widget.position);
                        break;
                }
            });

            this.$store.state.tools.legendTool = new Legend({
                view: view,
                title: '图例'
            });
            view.ui.add(new Expand({
                view: view,
                content: this.$store.state.tools.legendTool,
                expanded: false
            }), {
                position: "top-right"
            });

            // 距离测量工具(2D)
            this.$store.state.tools.measure2dTool = new Measurement({
                view: view
            });
            view.ui.add(this.$store.state.tools.measure2dTool, {
                position: 'top-right',
            });
            // 距离测量工具(3D)
            this.$store.state.tools.measure3dTool = new Measurement({
                view: sceneView
            });
            sceneView.ui.add(this.$store.state.tools.measure3dTool, {
                position: 'top-right',
            });
      
            view.when(async () => {
                this.$store.state.tools.sketchTool.on("create", function(evt) {
                    if (evt.state === "complete") {
                        const geom = evt.graphic.geometry;
                        switch (geom.type) {
                            case 'point':
                                console.log(`point: [${geom.x},${geom.y}]`);
                                axios({
                                    method: 'post',
                                    url: appconfig.datasource.addfeature_url,
                                    data: qs.stringify({
                                        FeatureClassName: 'hk_point',
                                        f: 'pjson',
                                        featureJSON: JSON.stringify({
                                            attributes: { name: '武汉www', address:'湖北武汉' }, 
                                            geometry: {x: `${geom.x}`, y: `${geom.y}` , spatialReference:{wkid:3857}}
                                        })
                                    }),
                                    headers: {
                                        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                                    }
                                }).then(function(response){
                                    console.log(response);
                                    //graphicsLayer.removeAll();
                                });
                                break;
                            case 'polyline':
                                console.log(`paths: ${geom.paths}`);
                                axios({
                                    method: 'post',
                                    url: appconfig.datasource.addfeature_url,
                                    data: qs.stringify({
                                        FeatureClassName: 'hk_line',
                                        f: 'pjson',
                                        featureJSON: JSON.stringify({
                                            attributes: { name: '武汉www' }, 
                                            "geometry":{"paths": geom.paths ,"spatialReference":{"wkid":3857}}
                                        })
                                    }),
                                    headers: {
                                        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                                    }
                                }).then(function(response){
                                    console.log(response);
                                    //graphicsLayer.removeAll();
                                });
                                break;
                            case 'polygon':
                                console.log(`rings: ${geom.rings}`);
                                axios({
                                    method: 'post',
                                    url: appconfig.datasource.addfeature_url,
                                    data: qs.stringify({
                                        FeatureClassName: 'hk_parcel',
                                        f: 'pjson',
                                        featureJSON: JSON.stringify({
                                            attributes: { name: '武汉www' }, 
                                            "geometry":{"rings": geom.rings ,"spatialReference":{"wkid":3857}}
                                        })
                                    }),
                                    headers: {
                                        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                                    }
                                }).then(function(response){
                                    console.log(response);
                                    //graphicsLayer.removeAll();
                                });
                                break;
                            default:
                                console.log(geom);
                        }
                    }
                });
            });
        }
    },
    async mounted () {
        this._createMapView()
    },
    computed: {
        // 滚动区高度
        // (业务需求：手机屏幕高度减去头部标题和底部tabbar的高度，当然这2个高度也是可以动态获取的)
        scrollerHeight: function() {
            return (window.innerHeight - 96 - 60) + 'px';
        }
    }
}
</script>

<style lang="less" scoped>
#map {
    width: 100%;
    // height: calc(80vh);
    z-index: 1;
}
/deep/ * {
    outline: none
}
/deep/ .esri-view .esri-view-surface--inset-outline:focus::after {
    outline: auto 0px Highlight !important;
    outline: auto 0px -webkit-focus-ring-color !important;
}
/deep/ .esri-ui .esri-attribution {
    visibility: hidden;
}
/deep/ .esri-popup__content {
    text-align: left;
}
/deep/ .esri-coordinate-conversion{
  width: 250px;
}
</style>