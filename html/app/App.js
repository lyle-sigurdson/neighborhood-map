/*jshint browser: true, devel: true */
import ko from 'knockout';

import ViewModel from './ViewModel';
import venuesList from './components/venues-list/main';
import venuesByCategory from './components/venues-by-category/main';
import searchFilter from './components/search-filter/main';
import VenuesMap from './components/venues-map/main';
import GeolocationDialog from './components/geolocation-dialog/main';
import dialogContainer from './components/dialog-container/main';

import getVenues from './getVenues';
import getIpinfo from './getIpinfo';
import getCurrentPosition from './getCurrentPosition.js';

import errors from './errors';

import './main.css!';

export default class {
    constructor() {
        this.viewModel = new ViewModel();
        this.geolocationDialog = new GeolocationDialog();
        this.venuesMap = new VenuesMap(this.viewModel);

        ko.components.register('venues-by-category', venuesByCategory);
        ko.components.register('venues-list', venuesList);
        ko.components.register('search-filter', searchFilter);
        ko.components.register('dialog-container', dialogContainer);

        ko.applyBindings(this.viewModel);
    }

    init() {
        const useGeolocationApi = this.viewModel.useGeolocationApi();

        let positionTask = null;

        if (useGeolocationApi === 'never') {
            positionTask = getIpinfo;
        } else {
            if ('geolocation' in window.navigator) {
                if (useGeolocationApi === 'no') {
                    positionTask = getIpinfo;
                    this.geolocationDialog.show().then(result => {
                        this.geolocationDialog.hide();
                        this.viewModel.useGeolocationApi(result);
                    });
                } else {
                    positionTask = getCurrentPosition;
                }
            } else {
                // Geolocation API is not available.
                if (useGeolocationApi === 'yes') {
                    // User has set a preference that instructs us to use
                    // geolocation services, but it is not available.
                    this.viewModel.showError(errors.ERR_DEVICE_GEO_UNAVAILABLE);
                }
                positionTask = getIpinfo;
            }
        }

        return Promise.all([ positionTask(), this.venuesMap.init() ]).then(results => {
            return getVenues(results[0].loc).then(venues => {
                this.viewModel.update(venues);
            }).catch(err => {
                this.viewModel.showError(errors.ERR_VENUE_DATA);
                console.log(err);
            });
        });
    }

    run() {
        this.venuesMap.addEventListener('dragend', e => {
            return getVenues(e).then(venues => {
                this.viewModel.update(venues);
            }).catch(err => {
                this.viewModel.showError(errors.ERR_VENUE_DATA);
                console.log(err);
            });
        });

        this.viewModel.useGeolocationApi.subscribe(newValue => {
            let positionTask = null;

            if (newValue === 'yes') {
                positionTask = getCurrentPosition;
            } else {
                // 'newValue' is either 'no' or 'never'.
                positionTask = getIpinfo;
            }

            positionTask().then(position => {
                return getVenues(position.loc).then(venues => {
                    return this.viewModel.update(venues);
                }).catch(err => {
                    this.viewModel.show(errors.ERR_VENUE_DATA);
                    console.log(err);
                });
            });
        });
    }
}
