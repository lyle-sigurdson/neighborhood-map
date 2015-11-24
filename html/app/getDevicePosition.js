/*jshint browser: true */

/* Return a location using the geolocation API */
export default function (options) {
    return new Promise((resolve, reject) => {
        if ('geolocation' in window.navigator) {
            window.navigator.geolocation.getCurrentPosition(position => {
                resolve({
                    loc: `${position.coords.latitude},` +
                         `${position.coords.longitude}`
                });
            }, reject, options);
        } else {
            reject('Geolocation API in not available');
        }
    });
}
