import xr from 'radiosilence/xr';

export default function (ll) {
    // Foursquare API version.
    const v = '20151008';

    return xr.get(`/foursquare-venues?ll=${ll}&v=${v}`).then(res => {
        if (res.apiProxyError) {
            throw new Error('getVenues: apiProxy: ' + JSON.stringify(res.apiProxyError));
        }

        if (res.meta.code !== 200) {
            throw new Error(`Foursquare: code ${res.meta.code}, ` +
                `errorType ${res.meta.errorType}`
            );
        }

        return res.response;
    });
}
