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

            this.viewModel.categories.subscribe(categories => {
                markers.forEach(marker => marker.setMap(null));
                markers.clear();

                let latLngBounds = new mapsApi.LatLngBounds();

                categories.forEach(category => {
                    category.venues.forEach(venue => {
                        let marker = new mapsApi.Marker({
                            map: this.map,
                            position: venue.location
                        });

                        // Must use an ES5 function literal here because google
                        // maps API binds the context of callbacks to the
                        // target (i.e., whatever was clicked.) This also means
                        // the return of the "this is that" pattern so I can
                        // access the view model.
                        let that = this;
                        marker.addListener('click', function () {
                            for (let pair of markers) {
                                if (pair[1] === this) {
                                    that.viewModel.selectVenue(pair[0]);
                                    break;
                                }
                            }
                        });

                        latLngBounds.extend(marker.getPosition());

                        markers.set(venue, marker);
                    });
                });

                if (categories.length) {
                    this.map.fitBounds(latLngBounds);
                }
            });

            this.viewModel.selectedVenue.subscribe(selected => {
                this.infoWindow.close();

                if (selected) {
                    this.infoWindow.setContent(infoWindowContent(selected));
                    this.infoWindow.open(this.map, markers.get(selected));
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
