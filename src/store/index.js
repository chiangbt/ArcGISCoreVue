import Vue from 'vue';
import Vuex from 'vuex';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        mapView: null,          // 地图视图对象
        sceneView: null,
        activeView: '2d',
        graphicsLayer: new GraphicsLayer({  // map中GraphicsLayer对象
            listMode: "hide"
        }),
        basemapList: [],        // 基础图层
        businessList: [],       // 业务图层
        currentBLayer: null,    // 当前业务层
        tools:{                 // 地图工具
            locateTool: null,
            locate3dTool: null,
            sketchTool: null,
            legendTool: null,
            mesure2dTool: null,
            measure3dTool: null
        }
    },
    mutations: {
        setMapView(state, obj) {
            state.mapView = obj;
        },
        setSceneView(state, obj){
            state.sceneView = obj
        },
        setActiveView(state, obj){
            state.activeView = obj
        },
        addBasemapList(state, obj){
            state.basemapList = obj;
        },
        addBusinessList(state, obj){
            state.businessList = obj;
        },
        setCurrentBLayer(state, obj){
            state.currentBLayer = obj;
        }
    }
})