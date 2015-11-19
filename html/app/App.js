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
        this.positionTask = null;

        ko.components.register('venues-by-category', venuesByCategory);
        ko.components.register('venues-list', venuesList);
        ko.components.register('search-filter', searchFilter);
        ko.components.register('dialog-container', dialogContainer);

        ko.applyBindings(this.viewModel);
    }

    init() {
        if (this.viewModel.useGeolocationApi() === 'yes') {
            this.positionTask = getCurrentPosition;
        } else {
            // useGeolocationApi is either 'no' or 'never'
            this.positionTask = getIpinfo;
        }

        return Promise.all([ this.positionTask(), this.venuesMap.init() ]).then(results => {
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
            if (newValue === 'yes') {
                this.positionTask = getCurrentPosition;
            } else {
                // 'newValue' is either 'no' or 'never'.
                this.positionTask = getIpinfo;
            }

            this.positionTask().then(position => {
                return getVenues(position.loc).then(venues => {
                    return this.viewModel.update(venues);
                }).catch(err => {
                    this.viewModel.show(errors.ERR_VENUE_DATA);
                    console.log(err);
                });
            });
        });

        if (this.viewModel.useGeolocationApi() === 'no') {
            this.geolocationDialog.show().then(userResponse => {
                this.geolocationDialog.hide();
                this.viewModel.useGeolocationApi(userResponse);
            });
        }
    }
}
