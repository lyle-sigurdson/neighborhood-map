import xr from 'radiosilence/xr';

export default function (ll) {
    // Foursquare API version.
    const v = '20151008',
          query = `/foursquare-venues?ll=${ll}&v=${v}`;

    return xr.get(query).then(res => {
        if (res.apiProxyError) {
            throw new Error('getVenues: apiProxy: ' + JSON.stringify(res.apiProxyError));
        }

        if (res.meta.code !== 200) {
            throw new Error(`Foursquare: code ${res.meta.code}, ` +
                `errorType ${res.meta.errorType}. Query was ${query}`
            );
        }

        return res.response;
    });
}
