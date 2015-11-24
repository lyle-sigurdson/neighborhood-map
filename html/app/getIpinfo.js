/*global fetch */
import 'github/fetch';

/*
    Return the information provided by the ipinfo.io service. No IP address is
    included in the query; this results in the IP address of the client being
    the query.
*/

export default function () {
    return fetch('/ipinfo/').then(response => {
        if (response.status === 200) {
            return response.json();
        }

        throw {
            name: response.statusText,
            message: `getIpinfo: ${response.status} ${response.statusText}`
        };

    }).then(json => {
        if (json.apiProxyError) {
            throw {
                name: json.name,
                message: `getIpinfo: ${json.message}`
            };
        }

        if (json.bogon) {
            throw {
                name: 'bogon',
                message: `getIpinfo: ipinfo.io: ` +
                         `bogon: ${json.ip} ${json.hostname}`
            };
        }

        return json;
    });
}
