/**
 * BaseLayer的类型
 * - tianditu: 天地图类型组合图层
 * - agstile: ArcGIS瓦片地图
 * - webtile: XYZ瓦片图层
 * - mwebtile: XYZ组合图层
 * - tencent: 腾讯图层
 */
module.exports = {
    view: {
        center: [120.038, 30.55],    // 视图默认中心点
        zoom: 9,                   // 视图默认缩放级别
        maxZoom: 20,                // 视图最大zoom
        minZoom: 3                  // 视图最小zoom
    },
    datasource: {                   // 数据源key
        tdt_key: '11e76d03bc7360fdeadc8b188044b715'     // 天地图key
    },
    // 地图组件
    widgets:[{
        type: 'Home',               // 组件类型
        id: 'myHome',               // 组件id
        position: 'top-left'        // 组件位置
    },{
        type: 'Coordinate',
        id: 'coordinate',
        position: 'bottom-right'
    },{
        type: 'Scalebar',
        id: 'myscalebar',
        position: 'bottom-left'
    }],
    // 基础图层
    currentBaseLayerIndex: 2,
    baselayer:[{
        label: '天地图街道',            // 图层名
        type: 'tianditu',             // 图层类型
        subDomains: ["0", "1", "2", "3", "4", "5", "6", "7"],   // 图层subDomains
        valid: true,                  // 是否添加到地图
        sublayer:[{
            url: 'http://t{subDomain}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=11e76d03bc7360fdeadc8b188044b715'
        },{
            url: 'http://t{subDomain}.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=11e76d03bc7360fdeadc8b188044b715'
        }]
    },{
        label: '天地图影像',
        type: 'tianditu',
        subDomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
        valid: true,
        sublayer:[{
            url: 'http://t{subDomain}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=394404c8b901574fdc4cdf8c18a98448'
        },{
            url: 'http://t{subDomain}.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk=394404c8b901574fdc4cdf8c18a98448'
        }]
    },{
        label: 'ESRI底图',
        url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer',
        type: 'agstile',
        valid: true
    },{
        label: 'ESRI矢量瓦片',
        url: 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer',
        type: 'agsvt',
        valid: true
    },{
        label: 'USGS底图',
        url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer',
        type: 'agstile',
        valid: true
    },{
        label: 'ESRI影像',
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
        type: 'agstile',
        valid: true
    },{
        label: 'ESRI影像(含注记)',
        type: 'tianditu',
        subDomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
        valid: true,
        sublayer:[{
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        },{
            url: 'http://t{subDomain}.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk=11e76d03bc7360fdeadc8b188044b715'
        }]
    },{
        label: 'ESRI Warm',
        url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer',
        type: 'agstile',
        valid: true
    },{
        label: 'ESRI Nat',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer',
        type: 'agstile',
        valid: true
    },{
        label: 'ESRI Hydro',
        url: 'http://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer',
        type: 'agstile',
        valid: true
    },{
        label: "OSM街道图",
        url: "https://{subDomain}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        subDomains: ["a", "b", "c", "d"],
        type: 'webtile',
        valid: true
    },{
        label: '高德地图',
        url: "http://webrd0{subDomain}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        subDomains: ["1", "2", "3", "4"],
        type: 'webtile',
        valid: true
    },{
        label: '高德影像',
        type: 'mwebtile',
        subDomains: ["1", "2", "3", "4"],
        valid: true,
        sublayer:[{
            url: 'http://webst0{subDomain}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
        },{
            url: 'http://webst0{subDomain}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
        }]
    },{
        label: '腾讯地图',
        url: "http://rt{subDomain}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&styleid=0",
        subDomains: ["1", "2", "3", "4"],
        type: 'tencent',
        ten_type: 'ROADNET',
        valid: true
    },{
        label: '腾讯夜景',
        url: "http://rt{subDomain}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&styleid=4",
        subDomains: ["1", "2", "3", "4"],
        type: 'tencent',
        ten_type: 'NIGHT',
        valid: true
    },{
        label: '腾讯地形',
        url: "https://p{subDomain}.map.gtimg.com/demTiles/{z}/{x16}/{y16}/{x}_{y}.jpg",
        subDomains: ["1", "2", "3", "4"],
        type: 'tencent',
        ten_type: 'TERRAIN',
        valid: true
    }],
    // 业务图层
    businessLayers:[{
        title: '纽约数据',
        key: '0',
        children: [{
            title: '纽约TMS(道路)',
            key: '0-1',
            type: 'tms',
            zoom: 13,
            center: [-73.95, 40.79],
            url: 'https://geoserver.geoportal.cn/geoserver/gwc/service/tms/1.0.0/tiger%3Atiger_roads@EPSG:900913@png/{z}/{x}/{y}.png',
            valid: true  
        },{
            title: '纽约WFS(点)',
            key: '0-2',
            type: 'wfs',
            zoom: 11,
            center: [-73.95, 40.79],
            url: 'https://geoserver.geoportal.cn/geoserver/tiger/ows',
            sublayers: 'tiger%3Apoi',
            popupTemplate: {
                "title": "NY Fire",
                "content": "<b>NAME:</b> {NAME}"
            },
            valid: true  
        },{
            title: '纽约WMS(面)',
            key: '0-3',
            type: 'geowms',
            zoom: 13,
            center: [-73.95, 40.79],
            url: 'https://geoserver.geoportal.cn/geoserver/tiger/ows',
            sublayers: 'tiger%3Apoly_landmarks',
            valid: true  
        },{
            title: '纽约WMTS',
            key: '0-4',
            type: 'wmts',
            zoom: 12,
            center: [-73.95, 40.79],
            url: 'https://geoserver.geoportal.cn/geoserver/gwc/service/wmts?',
            activeLayer: {
                id: "tiger-ny"
            },
            opacity: 0.5,
            valid: true  
        }]
    },{
        title: '洛杉矶数据',
        key: '1',
        children:[{
            title: '洛杉矶步道',
            key: '1-1',
            type: 'agsfeature',
            zoom: '13',
            center: [-118.80543, 34.02700],
            url: 'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0',
            outFields: ["TRL_NAME","CITY_JUR","X_STREET","PARKING","ELEV_FT"],
            popupTemplate: {
                "title": "Trailhead",
                "content": "<b>Trail:</b> {TRL_NAME}<br><b>City:</b> {CITY_JUR}<br><b>Cross Street:</b> {X_STREET}<br><b>Parking:</b> {PARKING}<br><b>Elevation:</b> {ELEV_FT} ft"
            },
            valid: true
        },{
            title: '洛杉矶步道线',
            key: '1-2',
            type: 'agsfeature',
            zoom: '13',
            center: [-118.80543, 34.02700],
            url: 'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails_Styled/FeatureServer/0',
            outFields: ["TRL_NAME","ELEV_GAIN"],
            popupTemplate: {
                "title": "Trail Information",
                "content": "<b>Trail:</b> {TRL_NAME}<br><b>ELEV_GAIN:</b> {ELEV_GAIN}"
            },
            valid: true
        }]
    },{
        title: '业务数据',
        key: '2',
        children:[{
            title: '夏威夷影像',            // 业务图层名
            key: '2-1',                 // 业务图层id
            type: 'agstile',            // 业务图层类型
            zoom: 15,                   // 业务图层zoom
            center: [-156.45, 20.72],   // 缩放的中心点
            url: 'https://tiles.arcgis.com/tiles/uO6HDVC9yRpI8sIE/arcgis/rest/services/Kihei2018Ortho/MapServer',
            valid: true
        },{
            title: 'NewKauai',
            key: '2-2',
            type: 'agstile',
            zoom: 14,
            center: [-159.37, 21.97],
            url: 'https://tiles.arcgis.com/tiles/uO6HDVC9yRpI8sIE/arcgis/rest/services/NewKauaiNeighbourhoodRef/MapServer',
            valid: true
        },{
            title: 'Brest(WMS)',
            key: '2-3',
            type: 'geowms',
            zoom: 15,
            center: [-4.49, 48.42],
            url: 'https://geobretagne.fr/geoserver/cadastre/ows',
            sublayers: 'CP.CadastralParcel',
            valid: true  
        },{
            title: '灯光影像',
            key: '2-4',
            type: 'agstile',
            zoom: 7,
            center: null,
            url: 'https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Earth_at_Night_2016/MapServer',
            valid: true
        }]
    },{
        title: '3D数据',
        key: '3',
        children:[{
            title: '3D建筑物',
            key: '3-1',
            type: 'scene',
            zoom: 13,
            center: [-73.95, 40.79],
            url: 'https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/New_York_LoD2_3D_Buildings/SceneServer/layers/0',
            valid: true
        }]
    }]
}