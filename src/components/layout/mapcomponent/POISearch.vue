<template>
    <a-auto-complete
        style="width: 100%"
        @select="onSelect"
        @search="handleSearch"
        placeholder="请输入地名..."
    >
        <template slot="dataSource">
            <a-select-option v-for="item in dataSource" :key="item.hotPointID" :value="item.lonlat" :opt="item">
                {{ item.name }}
            </a-select-option>
        </template>
        <a-input>
            <a-icon slot="suffix" type="search" class="certain-category-icon" />
        </a-input>
    </a-auto-complete>
</template>
<script>
import axios from 'axios';
import appconfig from './../../../config/appconfig';

export default {
    name: 'POISearch',
    data() {      
        return {
            dataSource: [], //数据源
        };
    },
    methods: {      
        //搜索事件
        handleSearch(value) {   
            this.dataSource = [];
            var that=this;
            axios.get('https://api.tianditu.gov.cn/search',{
                params:{
                    type: 'query',
                    tk: appconfig.datasource.tdt_key,
                    postStr: '{"yingjiType":0,"sourceType":0,"keyWord":"'+ value +'","level":3,"mapBound":"-14.94553,-20.55951,145.89432,68.62104","queryType":1,"start":0,"count":10,"queryTerminal":10000}'
                }
            }).then(res=>{
                // console.log(res.data.pois)
                that.dataSource = res.data.pois;
            })
        },      
        //选择下拉框事件
        onSelect(value, option) {
            var latlng = value.split(" ");
            var center = [parseFloat(latlng[0]), parseFloat(latlng[1])]
            this.$store.state.mapView.goTo({center: center, zoom: 17});
            var obj = option.data.attrs.opt;
            this.$store.state.mapView.popup.open({
                title: obj.name,
                content: "<span>地址:"+ obj.address +"</span><br/><span>电话:"+ obj.phone +"</span>",
                location: center
            });
        },
    },
}
</script>