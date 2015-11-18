import ghfetch from 'github/fetch';

export default function () {
    return ghfetch.fetch('/ipinfo/').then(response => {
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
                message: `getIpinfo: ${json.message}`
            };
        }

        return json;
    });
}
