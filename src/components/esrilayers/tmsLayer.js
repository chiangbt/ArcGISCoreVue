/**
 * 适合TMS类型图层（包括GeoServer）
 */
import BaseTileLayer from '@arcgis/core/layers/BaseTileLayer';

let tmsLayer = BaseTileLayer.createSubclass({
    // properties of the custom tile layer
    properties: {
        urlTemplate: null,
    },

    // override getTileUrl()
    getTileUrl: function (level, row, col) {
        // 这里对y轴瓦片编号进行转置
        let y2 = Math.pow(2, level) - row - 1;
        return this.urlTemplate
            .replace("{z}", level)
            .replace("{x}", col)
            .replace("{y}", y2); 
    },
});
export default tmsLayer;