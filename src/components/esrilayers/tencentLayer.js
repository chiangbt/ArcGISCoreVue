/**
 * 适合腾讯地图图层
 */
import CoordConver from './utils/CoordConver';
import BaseTileLayer from '@arcgis/core/layers/BaseTileLayer';
import esriRequest from '@arcgis/core/request';
import Point from '@arcgis/core/geometry/Point';
// import TileInfo from '@arcgis/core/layers/support/TileInfo';

let tencentLayer = BaseTileLayer.createSubclass({
    properties: {
        urlTemplate: null,
        // tint: "#71DE6E", // 在图像中形成反差色
        ten_type: ''
    },

    // override getTileUrl()
    getTileUrl: function (level, row, col) {
        var numY=Math.pow(2,level)-1-row;
        var num = col % 3;

        var mapurl ='';

        switch (this.ten_type) {
            case "ROADNET":
                mapurl = this.urlTemplate.replace("{subDomain}", num).replace("{z}", level).replace("{x}", col).replace("{y}", numY);
                break;
            case "TERRAIN":
                var x16 = Math.floor(col / 16);
                var y16 = Math.floor((Math.pow(2, level) - 1 - row) / 16);
                mapurl = this.urlTemplate.replace("{subDomain}", num).replace("{z}", level)
                    .replace("{x}", col).replace("{y}", numY).replace("{x16}", x16).replace("y16", y16);
                break;
            case "SATELLITE":
                var x_16 = Math.floor(col / 16);
                var y_16 = Math.floor((Math.pow(2, level) - 1 - row) / 16);
                mapurl = this.urlTemplate.replace("{subDomain}", num).replace("{z}", level)
                    .replace("{x}", col).replace("{y}", numY).replace("{x16}", x_16).replace("y16", y_16);
                break;
            case "NIGHT":
                mapurl = this.urlTemplate.replace("{subDomain}", num).replace("{z}", level).replace("{x}", col).replace("{y}", numY);
                break;
            default:
                this._url = this._url.replace('{t}', 0);
                break;
        }
        return mapurl;
    },

    fetchTile: function(level, row, col, options) { 
        //Build the slice URL
        var url = this.getTileUrl(level, row, col); 
        // request for tiles based on the generated url
        // set allowImageDataAccess to true to allow
        // cross-domain access to create WebGL textures for 3D.
        var tr_pt = CoordConver.gps84_To_gcj02(this.tileInfo.origin.longitude, this.tileInfo.origin.latitude);
        var pt = new Point({
            longitude: tr_pt.lng,
            latitude: tr_pt.lat
        });
        this.tileInfo.origin = pt;
        this.tileInfo.updateTileInfo({
            origin: pt
        })

        return esriRequest(url, {
                responseType: "image",
                allowImageDataAccess: true,
                signal: options.signal
            })
            .then(function(response) {
                // when esri request resolves successfully
                // get the image from the response
                var image = response.data;

                var width = this.tileInfo.size[0];
                var height = this.tileInfo.size[0]; 
                // create a canvas with 2D rendering context
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                canvas.width = width;
                canvas.height = height; 
            
                if (this.tint) {
                    // Get a CSS color string in rgba form
                    // representing the tint Color instance.
                    context.fillStyle = this.tint;
                    context.fillRect(0, 0, width, height);
                    context.globalCompositeOperation = "difference";
                }
                // Draw the blended image onto the canvas.
                context.drawImage(image, 0, 0, width, height); 
                return canvas;
            }.bind(this));
    }
});
export default tencentLayer;