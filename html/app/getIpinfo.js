import xr from 'radiosilence/xr';

export default function () {
    return xr.get('/ipinfo/').then(ipinfo => {
        if (ipinfo.apiProxyError) {
            throw new Error('getIpinfo: apiProxy: ' + JSON.stringify(ipinfo.apiProxyError));
        }

        if (ipinfo.hasOwnProperty('bogon')) {
            throw new Error(`ipinfo.io: bogon ${ipinfo.ip} ${ipinfo.hostname}`);
        }

        return ipinfo;
    });
}
