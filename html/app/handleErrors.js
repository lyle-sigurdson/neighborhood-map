/*
 * Handle errors; intended to be used as an argument to Promise catches.
 */
export default function (viewModel, err) {
    if (err.code) {
        // This is an exception from the geolocation API. We can use the
        // location provided by ipinfo as a fallback, so this is merely a
        // warning.
        viewModel.showError({
            level: 'warning',
            message: `Geolocation not available (${err.message}).`
        });

        // Fall back to ipinfo.io.
        viewModel.useGeolocationApi('no');
    } else {
        // Something more serious happened and there's no fallback.
        viewModel.showError({
            level: 'critical',
            message: err.message
        });

        throw err;
    }
}
