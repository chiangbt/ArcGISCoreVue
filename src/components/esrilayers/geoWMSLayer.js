/**
 * 适合GeoServer发布的WMS图层
 */
import BaseDynamicLayer from '@arcgis/core/layers/BaseDynamicLayer';

const geoWMSLayer = BaseDynamicLayer.createSubclass({
    properties: {
        mapUrl: null,
        mapParameters: null
    },

    // Override the getImageUrl() method to generate URL
    // to an image for a given extent, width, and height.
    getImageUrl: function (extent, width, height) {
        const urlVariables = this._prepareQuery(
            this.mapParameters,
            extent,
            width,
            height
        );
        const queryString = this._joinUrlVariables(urlVariables);
        return this.mapUrl + "?" + queryString;
    },

    // Prepare query parameters for the URL to an image to be generated
    _prepareQuery: function (queryParameters, extent, width, height) {
        const wkid = extent.spatialReference.isWebMercator ? 3857 : extent.spatialReference.wkid;
        const replacers = {
            width: width,
            height: height,
            wkid: wkid,
            xmin: extent.xmin,
            xmax: extent.xmax,
            ymin: extent.ymin,
            ymax: extent.ymax
        };

        const urlVariables = this._replace({}, queryParameters, replacers);
        return urlVariables;
    },

    // replace the url variables with the application provided values
    _replace: (urlVariables, queryParameters, replacers) => {
        Object.keys(queryParameters).forEach((key) => {
            urlVariables[key] = Object.keys(replacers).reduce((previous, replacerKey) => {
                    return previous.replace("{" + replacerKey + "}", replacers[replacerKey]);
                },
                queryParameters[key]
            );
        });

        return urlVariables;
    },

    // join the url parameters
    _joinUrlVariables: (urlVariables) => {
        return Object.keys(urlVariables).reduce((previous, key) => {
            return (previous + (previous ? "&" : "") + key + "=" + urlVariables[key]);
        }, "");
    }
});
export default geoWMSLayer;