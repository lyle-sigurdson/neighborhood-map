/*jshint browser: true */
import ko from 'knockout';
import template from './template.html!text';
import mapsApiLoader from 'google-maps-api';
import config from 'app/app-config.json!';

export default class {
    constructor(viewModel) {
        this.viewModel = viewModel;
        this.mapsApi = null;
        this.map = null;

        ko.components.register('venues-map', {
            viewModel: { instance: viewModel },
            template: template
        });
    }

    init() {
        return mapsApiLoader(config.googleApiKey)().then(mapsApi => {
            this.mapsApi = mapsApi;

            this.map = new this.mapsApi.Map(document.getElementById('venues-map--map'));

            let markers = [];

            this.viewModel.venues.subscribe(venues => {
                markers.forEach(marker => marker.setMap(null));
                markers = [];

                let latLngBounds = new mapsApi.LatLngBounds();

                venues.forEach(venue => {
                    let marker = new mapsApi.Marker({
                        map: this.map,
                        position: venue.location
                    });

                    latLngBounds.extend(marker.getPosition());

                    markers.push(marker);
                });

                if (venues.length) {
                    this.map.fitBounds(latLngBounds);
                }
            });
        });
    }

    addEventListener(event, f) {
        this.map.addListener(event, () => {
            const center = this.map.getCenter(),
                  wrappedCenter = new this.mapsApi.LatLng(
                      center.lat(), center.lng()
                  );

            f.call(this, `${wrappedCenter.lat()},${wrappedCenter.lng()}`);
        });
    }
}
