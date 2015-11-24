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
        let that = this;

        return mapsApiLoader(config.googleApiKey)().then(mapsApi => {
            this.mapsApi = mapsApi;
            this.infoWindow = new this.mapsApi.InfoWindow();

            // Deselect the venue when its info window is closed. */
            mapsApi.event.addListener(this.infoWindow, 'closeclick', () => {
                this.viewModel.selectVenue(null);
            });

            // Initialize the google map; don't clear out the Foursquare
            // attribution img element.
            this.map = new this.mapsApi.Map(
                document.getElementById('venues-map'), { noClear: true }
            );

            // Deslect venue when map is clicked on a spot that doesn't have a
            // click handler.
            this.map.addListener('click', () => {
                this.viewModel.selectVenue(null);
            });

            // A map data structure to store references to venues and map
            // markers; venue references are the keys, marker references are the
            // values.
            let markers = new Map();

            let latLngBounds = null;

            // Update the display of the map whenever the categories and venues
            // within the categories are updated.
            this.viewModel.categories.subscribe(categories => {
                // Clear out any previous markers.
                markers.forEach(marker => marker.setMap(null));
                markers.clear();

                // Start with an empty bounds.
                latLngBounds = new mapsApi.LatLngBounds();

                // Create and set up map markers for the new categories/venues.
                categories.forEach(category => {
                    category.venues.forEach((venue, i) => {
                        let marker = new mapsApi.Marker({
                            map: this.map,
                            position: venue.location,
                            zIndex: i,
                            icon: {
                                path: mapsApi.SymbolPath.CIRCLE,
                                scale: 10,
                                strokeWeight: 3,
                                strokeColor: '#FFF',
                                fillColor: category.color,
                                fillOpacity: 1
                            }
                        });

                        // Add click handlers to the map markers.
                        //
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

                        marker.addListener('mouseover', function () {
                            that.viewModel.hoverVenue({ venue: venue, hoverOrigin: that });
                        });

                        marker.addListener('mouseout', function () {
                            that.viewModel.hoverVenue({ venue: null, hoverOrigin: that });
                        });

                        // Make marker react appropriately to changes in its
                        // associated venue's visibility.
                        venue.visible.subscribe(visible => {
                            if (!visible && this.viewModel.isVenueSelected(venue)) {
                                this.infoWindow.close();
                            }

                            if (visible && this.viewModel.isVenueSelected(venue)) {
                                this.infoWindow.setContent(infoWindowContent(venue));
                                this.infoWindow.open(this.map, markers.get(venue));
                            }

                            marker.setVisible(visible);
                        });

                        // Extend the bounds with new marker.
                        latLngBounds.extend(marker.getPosition());

                        markers.set(venue, marker);
                    });
                });

                if (categories.length) {
                    // Reposition the map to show all the markers.
                    this.map.fitBounds(latLngBounds);
                }
            });

            // Re-center the map when the viewport is resized. The docs say:
            //     Developers should trigger this event on the map when the div
            //     changes size: google.maps.event.trigger(map, 'resize')
            // but doing this doesn't re-center the map.
            // Also, the setTimeout is a hack, but it won't work if I run it
            // without the delay.
            window.addEventListener('resize', () => {
                setTimeout(() => {
                    that.map.fitBounds(latLngBounds);
                }, 200);
            });

            // Set appearance and stack level of deselected map marker.
            this.viewModel.selectedVenue.subscribe(deselected => {
                let deselectedMarker = markers.get(deselected);

                if (deselectedMarker) {
                    deselectedMarker.setIcon(Object.assign(
                        deselectedMarker.getIcon(), { strokeColor: '#FFF' }
                    ));
                    deselectedMarker.setZIndex(0);
                }
            }, this, 'beforeChange');

            // Set appearance and stack level of selected map marker.
            this.viewModel.selectedVenue.subscribe(selected => {
                // Make sure info window is only open once.
                this.infoWindow.close();

                let selectedMarker = markers.get(selected);

                if (selected) {
                    this.infoWindow.setContent(infoWindowContent(selected));
                    this.infoWindow.open(this.map, selectedMarker);
                    selectedMarker.setZIndex(markers.length);
                    selectedMarker.setIcon(Object.assign(
                        selectedMarker.getIcon(),
                        { strokeColor: 'rgb(142, 142, 142)' }
                    ));
                    selectedMarker.setAnimation(null);
                }
            });

            // Set appearance of marker when it becomes not hovered over.
            this.viewModel.hoveredVenue.subscribe(unHovered => {
                if (unHovered && unHovered.venue) {
                    let unHoveredMarker = markers.get(unHovered.venue);

                    if (unHoveredMarker) {
                        if (this.viewModel.isVenueSelected(unHovered.venue)) {
                            unHoveredMarker.setIcon(Object.assign(
                                unHoveredMarker.getIcon(),
                                { strokeColor: 'rgb(142, 142, 142)' }
                            ));

                        } else {
                            unHoveredMarker.setIcon(Object.assign(
                                unHoveredMarker.getIcon(),
                                { strokeColor: '#FFF' }
                            ));

                            unHoveredMarker.setAnimation(null);
                        }
                    }
                }
            }, this, 'beforeChange');

            // Set appearance of marker when it becomes hovered over.
            this.viewModel.hoveredVenue.subscribe(hovered => {
                if (hovered.venue) {
                    let hoveredMarker = markers.get(hovered.venue);

                    if (this.viewModel.isVenueSelected(hovered.venue)) {
                        hoveredMarker.setIcon(Object.assign(
                            hoveredMarker.getIcon(),
                            { strokeColor: 'rgb(132, 132, 132)' }
                        ));
                    } else {
                        hoveredMarker.setIcon(Object.assign(
                            hoveredMarker.getIcon(),
                            { strokeColor: 'rgb(200, 200, 200)' }
                        ));

                        if (hovered.hoverOrigin !== this) {
                            hoveredMarker.setAnimation(mapsApi.Animation.BOUNCE);
                        }
                    }
                }
            });
        });
    }

    // Allow outside components to subscribe to map events with a callback. The
    // callback's only argument is a string in the form:
    //     <latitude>,<longitude>
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
