import ghfetch from 'github/fetch';

export default function (ll) {
    // Foursquare API version.
    const v = '20151008',
          query = `/foursquare-venues?ll=${ll}&v=${v}`;

    return ghfetch.fetch(query).then(response => {
        if (response.status === 200) {
            return response.json();
        }

        throw {
            name: response.statusText,
            message: `getVenues: ${response.status} ${response.statusText}`
        };

    }).then(json => {
        if (json.apiProxyError) {
            throw {
                name: json.name,
                message: `getVenues: ${json.message}`
            };
        }

        if (json.meta.code === 200) {
            return json.response;
        }

        throw {
            name: json.meta.errorType,
            message: `getVenues: foursquare: ${json.meta.code} ` +
                     `${json.meta.errorType}, query was "${query}"`
        };
    });
}
