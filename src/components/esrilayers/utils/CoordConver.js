//坐标转换
class CoordConver {

    constructor(){
        this.pi = 3.1415926535897932384626,
        this.a = 6378245.0,
        this.ee = 0.00669342162296594323,
        this.x_pi = this.pi * 3000.0 / 180.0,
        this.R = 6378137;
    }

    transformLat(x, y) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.pi) + 20.0 * Math.sin(2.0 * x * this.pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * this.pi) + 40.0 * Math.sin(y / 3.0 * this.pi)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * this.pi) + 320 * Math.sin(y * this.pi / 30.0)) * 2.0 / 3.0;
        return ret;
    }

    transformLng(x, y) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.pi) + 20.0 * Math.sin(2.0 * x * this.pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * this.pi) + 40.0 * Math.sin(x / 3.0 * this.pi)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * this.pi) + 300.0 * Math.sin(x / 30.0 * this.pi)) * 2.0 / 3.0;
        return ret;
    }

    transform(lng, lat) {
        var dLat = this.transformLat(lng - 105.0, lat - 35.0);
        var dLng = this.transformLng(lng - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.pi;
        var magic = Math.sin(radLat);
        magic = 1 - this.ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.pi);
        dLng = (dLng * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.pi);
        var mgLat = lat + dLat;
        var mgLng = lng + dLng;
        var newCoord = {
            lng: mgLng,
            lat: mgLat
        };
        return newCoord;
    }

    /**百度转84*/
    bd09_To_gps84(lng, lat) {
        var gcj02 = this.bd09_To_gcj02(lng, lat);
        var map84 = this.gcj02_To_gps84(gcj02.lng, gcj02.lat);
        return map84;
    }

    /**84转百度*/
    gps84_To_bd09(lng, lat) {
        var gcj02 = this.gps84_To_gcj02(lng, lat);
        var bd09 = this.gcj02_To_bd09(gcj02.lng, gcj02.lat);
        return bd09;
    }

    /**84转火星*/
    gps84_To_gcj02(lng, lat) {
        var dLat = this.transformLat(lng - 105.0, lat - 35.0);
        var dLng = this.transformLng(lng - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.pi;
        var magic = Math.sin(radLat);
        magic = 1 - this.ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.pi);
        dLng = (dLng * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.pi);
        var mgLat = lat + dLat;
        var mgLng = lng + dLng;
        var newCoord = {
            lng: mgLng,
            lat: mgLat
        };
        return newCoord;
    }

    /**火星转84*/
    gcj02_To_gps84(lng, lat) {
        var coord = this.transform(lng, lat);
        var lontitude = lng * 2 - coord.lng;
        var latitude = lat * 2 - coord.lat;
        var newCoord = {
            lng: lontitude,
            lat: latitude
        };
        return newCoord;
    }

    /**火星转百度*/
    gcj02_To_bd09(x, y) {
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        var newCoord = {
            lng: bd_lng,
            lat: bd_lat
        };
        return newCoord;
    }

    /**百度转火星*/
    bd09_To_gcj02(bd_lng, bd_lat) {
        var x = bd_lng - 0.0065;
        var y = bd_lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        var newCoord = {
            lng: gg_lng,
            lat: gg_lat
        };
        return newCoord;
    }
}
export default new CoordConver;