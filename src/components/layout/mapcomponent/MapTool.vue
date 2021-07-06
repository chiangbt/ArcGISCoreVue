<template>
    <div>
        <a-button-group>
            <a-button type="primary" v-on:click="changeView">2/3D</a-button>
        </a-button-group>
        &nbsp;
        <a-button-group>
            <a-button type="primary" icon='pushpin' v-on:click="locate"></a-button>
        </a-button-group>
        &nbsp;
        <a-button-group>
            <a-button type="primary" icon="ellipsis" v-on:click="addPoint">点</a-button>
            <a-button type="primary" icon="fork" v-on:click="addPolyline">线</a-button>
            <a-button type="primary" icon="gateway" v-on:click="addPolygon">面</a-button>
            <a-button type="danger" icon="rest" v-on:click="clearGraphic"></a-button>
        </a-button-group>
        &nbsp;
        <a-button-group>
            <a-button type="primary" icon="column-width" v-on:click="measureLength">距离</a-button>
            <a-button type="primary" icon="align-center" v-on:click="measureArea">面积</a-button>
            <a-button type="danger" icon="close" v-on:click="clearMeasure"></a-button>
        </a-button-group>
    </div>
</template>

<script>
export default {
    name: 'MapTool',
    methods: {
        // 切换2/3D视图
        changeView(){
            if(this.$store.state.activeView === '2d'){
                this.$store.state.sceneView.viewpoint = this.$store.state.mapView.viewpoint;
                this.$store.state.mapView.container = null;
                this.$store.state.sceneView.container = 'map';
                this.$store.commit('setActiveView', '3d');
            }else{
                this.$store.state.mapView.viewpoint = this.$store.state.sceneView.viewpoint;
                this.$store.state.mapView.viewpoint.rotation = 0;
                this.$store.state.sceneView.container = null;
                this.$store.state.mapView.container = 'map';
                this.$store.commit('setActiveView', '2d');
            }
        },
        // 定位
        locate(){
            if(this.$store.state.activeView === '2d'){
                this.$store.state.tools.locateTool.locate();
            }else{
                this.$store.state.tools.locate3dTool.locate();
            }
        },
        // 添加点
        addPoint(){
            if(this.$store.state.activeView === '2d'){
                this.$store.state.tools.sketchTool.create("point");
            }else{
                this.$message.error('本工具只能在2D视图中使用!');
            }
        },
        // 添加线
        addPolyline(){
            if(this.$store.state.activeView === '2d'){
                this.$store.state.tools.sketchTool.create("polyline");
            }else{
                this.$message.error('本工具只能在2D视图中使用!');
            }
        },
        // 添加面
        addPolygon(){
            if(this.$store.state.activeView === '2d'){
                this.$store.state.tools.sketchTool.create("polygon");
            }else{
                this.$message.error('本工具只能在2D视图中使用!');
            }
        },
        // 移除sketch内容
        clearGraphic(){
            if(this.$store.state.activeView === '2d'){
                this.$store.state.graphicsLayer.removeAll();
            }else{
                this.$message.error('本工具只能在2D视图中使用!');
            }
        },
        // 距离量测
        measureLength(){
            if(this.$store.state.activeView === '2d'){
                this.$store.state.tools.measure2dTool.activeTool = 'distance';
                this.$store.state.tools.measure2dTool.watch('activeWidget', function (evt) {
                    if (evt !== null) {
                        evt.viewModel.palette.handleColor = [255, 64, 64, 0.5];
                        evt.viewModel.palette.handleWidth = 6;
                        evt.viewModel.palette.pathWidth = 2;
                    }
                });
            }else{
                this.$store.state.tools.measure3dTool.activeTool = 'direct-line';
            }
        },
        // 面积量测
        measureArea(){
            if(this.$store.state.activeView === '2d'){
                this.$store.state.tools.measure2dTool.activeTool = 'area';
                this.$store.state.tools.measure2dTool.watch('activeWidget', function (evt) {
                    if (evt !== null) {
                        evt.viewModel.palette.fillColor = [255, 48, 48, 0.3];
                        evt.viewModel.palette.handleColor = [255, 64, 64, 0.5];
                        evt.viewModel.palette.pathColor = [255, 48, 48, 0.8];
                    }
                });
            }else{
                this.$store.state.tools.measure3dTool.activeTool = 'area';
            }
        },
        // 清除量测
        clearMeasure(){
            if(this.$store.state.activeView === '2d'){
                this.$store.state.tools.measure2dTool.activeTool = null;
            }else{  
                this.$store.state.tools.measure3dTool.activeTool = null;
            }
        }
    }
}
</script>