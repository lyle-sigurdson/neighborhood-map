/*jshint browser: true */
import ko from 'knockout';
import template from './template.html!text';
import {} from './style.css!';
import mapsApi from 'google-maps-api';
import config from 'app/app-config.json!';

export default class {
    constructor(viewModel) {
        this.viewModel = viewModel;
        this.map = null;

        ko.components.register('venues-map', {
            viewModel: { instance: viewModel },
            template: template
        });
    }

    init() {
        return mapsApi(config.googleApiKey)().then(maps => {
            this.map = new maps.Map(document.getElementById('venues-map--map'));

            let markers = [];

            this.viewModel.venues.subscribe(venues => {
                markers.forEach(marker => marker.setMap(null));
                markers = [];

                let latLngBounds = new maps.LatLngBounds();

                venues.forEach(venue => {
                    let marker = new maps.Marker({
                        map: this.map,
                        position: venue.location
                    });

                    latLngBounds.extend(marker.getPosition());

                    markers.push(marker);
                });

                this.map.fitBounds(latLngBounds);
            });
        });
    }

    addEventListener(event, f) {
        this.map.addListener(event, f);
    }
}
