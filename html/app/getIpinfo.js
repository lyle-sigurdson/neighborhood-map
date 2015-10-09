import xr from 'radiosilence/xr';

export default function () {
    return xr.get('/ipinfo/').then(ipinfo => {
        console.log('ipinfo', ipinfo);
        if (ipinfo.hasOwnProperty('bogon')) {
            throw new Error(`ipinfo.io: bogon ${ipinfo.ip} ${ipinfo.hostname}`);
        }
        return ipinfo;
    });
}
