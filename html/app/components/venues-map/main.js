/*jshint browser: true */
import mapsApiLoader from 'google-maps-api';
import config from 'app/app-config.json!';
import infoWindowContent from './infoWindowContent.js';

export default class {
    constructor(viewModel) {
        this.viewModel = viewModel;
        this.mapsApi = null;
        this.map = null;
        this.infoWindow = null;
    }

    init() {
        return mapsApiLoader(config.googleApiKey)().then(mapsApi => {
            this.mapsApi = mapsApi;
            this.infoWindow = new this.mapsApi.InfoWindow();

            mapsApi.event.addListener(this.infoWindow, 'closeclick', () => {
                this.viewModel.selectVenue(null);
            });

            this.map = new this.mapsApi.Map(document.getElementById('venues-map'));

            let markers = new Map();

            this.viewModel.venues.subscribe(venues => {
                markers.forEach(marker => marker.setMap(null));
                markers.clear();

                let latLngBounds = new mapsApi.LatLngBounds();

                venues.forEach(venue => {
                    let marker = new mapsApi.Marker({
                        map: this.map,
                        position: venue.location
                    });

                    latLngBounds.extend(marker.getPosition());

                    markers.set(venue.id, marker);
                });

                if (venues.length) {
                    this.map.fitBounds(latLngBounds);
                }
            });

            this.viewModel.selectedVenue.subscribe(selected => {
                this.infoWindow.close();

                if (selected) {
                    this.infoWindow.setContent(infoWindowContent(selected));
                    this.infoWindow.open(this.map, markers.get(selected.id));
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
