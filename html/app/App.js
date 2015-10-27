/*jshint browser: true */
import config from './app-config.json!';

import ko from 'knockout';
import humane from 'humane-js';
//import {} from '../jspm_packages/github/wavded/humane-js@3.2.2/themes/original.css!';

import ViewModel from './ViewModel';
import Preferences from './Preferences.js';
import VenuesList from './components/venues-list/main';
import VenuesByCategory from './components/venues-by-category/main';
import VenuesMap from './components/venues-map/main';
import GeolocationDialog from './components/geolocation-dialog/main';

import getVenues from './getVenues';
import getIpinfo from './getIpinfo';
import getCurrentPosition from './getCurrentPosition.js';

import './main.css!';

export default class {
    constructor() {
        this.preferences = new Preferences('__NM__', config.defaultPreferences);
        this.viewModel = new ViewModel();
        this.venuesList = new VenuesList();
        this.venuesByCategory = new VenuesByCategory(this.viewModel);
        this.geolocationDialog = new GeolocationDialog();
        this.venuesMap = new VenuesMap(this.viewModel);
        ko.applyBindings(this.viewModel);

    }

    init() {
        const useGeolocationApi = this.preferences.getItem('useGeolocationApi');

        let positionTask = null;

        if (useGeolocationApi === 'never') {
            positionTask = getIpinfo;
        } else {
            if ('geolocation' in window.navigator) {
                if (useGeolocationApi === 'no') {
                    positionTask = getIpinfo;
                    this.geolocationDialog.show().then(result => {
                        this.geolocationDialog.hide();
                        this.preferences.setItem('useGeolocationApi', result);
                    });
                } else {
                    positionTask = getCurrentPosition;
                }
            } else {
                // Geolocation API is not available.
                if (useGeolocationApi === 'yes') {
                    // User has set a preference that instructs us to use
                    // geolocation services, but it is not available.
                    humane.log(
                        'Geolocation is not available; falling back to IP ' +
                        'address-based geolocation.',
                        { timeout: 10 * 1000, clickToClose: true }
                    );
                }
                positionTask = getIpinfo;
            }
        }

        return Promise.all([ positionTask(), this.venuesMap.init() ]).then(results => {
            return getVenues(results[0].loc).then(venues => {
                this.viewModel.update(venues);
            }).catch(err => {
                humane.log(
                    'Cannot retrieve venue data. Error message was: ' + err,
                    { timeout: 10 * 1000, clickToClose: true }
                );
            });
        });
    }

    run() {
        this.venuesMap.addEventListener('dragend', e => {
            return getVenues(e).then(venues => {
                this.viewModel.update(venues);
            }).catch(err => {
                humane.log(
                    'Cannot retrieve venue data. Error message was: ' + err,
                    { timeout: 10 * 1000, clickToClose: true }
                );
            });
        });

        this.preferences.addEventListener('useGeolocationApi', e => {
            let positionTask = null;

            if (e.newValue === 'yes') {
                positionTask = getCurrentPosition;
            } else {
                // 'newValue' is either 'no' or 'never'.
                positionTask = getIpinfo;
            }

            positionTask().then(position => {
                return getVenues(position.loc).then(venues => {
                    return this.viewModel.update(venues);
                }).catch(err => {
                    humane.log(
                        'Cannot retrieve venue data. Error message was: ' + err,
                        { timeout: 10 * 1000, clickToClose: true }
                    );
                });
            });
        });
    }
}
