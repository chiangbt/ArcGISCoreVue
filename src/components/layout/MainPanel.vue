<template>
    <a-layout-content
        :style="{ margin: '12px 12px', marginLeft: '0px', padding: '12px', background: '#fff', minHeight: '280px' }"
    >
        <a-row type="flex" justify="start">
            <a-col :span="18" style="text-align:left; padding-bottom: 5px;">
                <MapTool></MapTool>
            </a-col>
            <a-col :span="6" style="text-align:right;">
                <POISearch></POISearch>
            </a-col>
        </a-row>
        <a-row>
            <a-col>
                <MapObj></MapObj>
            </a-col>
        </a-row>
    </a-layout-content>
</template>

<script>
import MapObj from './mapcomponent/MapObj.vue';
import POISearch from './mapcomponent/POISearch.vue';
import MapTool from './mapcomponent/MapTool.vue';

export default {
    name: 'MainPanel',
    components: {
        MapObj,
        POISearch,
        MapTool
    }
}
</script>