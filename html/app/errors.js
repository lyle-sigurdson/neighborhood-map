export default {
    ERR_DEVICE_GEO_UNAVAILABLE: {
        message: `Device geolocation is not available; falling back to less
                  accurate IP address-based geolocation.`,
        level: 'warning'
    },
    ERR_IP_GEO_UNAVAILABLE: {
        message: 'Cannot retrieve IP address-based geolocation.',
        level: 'critical'
    },
    ERR_VENUE_DATA: {
        message: 'Cannot retrieve venue data.',
        level: 'critical'
    }
};
