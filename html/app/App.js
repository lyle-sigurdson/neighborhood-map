/*jshint browser: true */
import ko from 'knockout';

import ViewModel from './ViewModel';
import Component01 from './components/component-01/main';
import VenuesMap from './components/venues-map/main';

import GeolocationDialog from './components/geolocation-dialog/main';

import getVenues from './getVenues';
import getIpinfo from './getIpinfo';
import getCurrentPosition from './getCurrentPosition.js';

import Preferences from './Preferences.js';

import config from './app-config.json!';

export default class {
    constructor() {
        this.preferences = new Preferences('__NM__', config.defaultPreferences);
        this.viewModel = new ViewModel();
        this.component01 = new Component01(this.viewModel);
        this.geolocationDialog = new GeolocationDialog();
        this.venuesMap = new VenuesMap(this.viewModel);
        this.initTasks = [];
        ko.applyBindings(this.viewModel);
    }

    init() {
        const useGeolocationApi = this.preferences.getItem('useGeolocationApi');

        if (useGeolocationApi === 'never') {
            this.initTasks.push(getIpinfo());
        } else {
            if ('geolocation' in window.navigator) {
                if (useGeolocationApi === 'no') {
                    this.initTasks.push(getIpinfo());
                    this.geolocationDialog.show().then(result => {
                        this.geolocationDialog.hide();
                        this.preferences.setItem('useGeolocationApi', result);
                    });
                } else {
                    this.initTasks.push(getCurrentPosition());
                }
            } else {
                // Geolocation API is not available.
                if (useGeolocationApi === 'yes') {
                    // User has set a preference that instructs us to use
                    // geolocation services, but it is not available.
                    // TODO show appropriate error message saying falling back
                    // to a less accurate ip-based geolocation method. This
                    // should also grey out the control to set this preference
                    // on any preferences screen.
                }
                this.initTasks.push(getIpinfo());
            }
        }

        this.initTasks.push(this.venuesMap.init());

        return Promise.all(this.initTasks).then(results => {
            return getVenues(results[0].loc).then(venues => {
                this.viewModel.update(venues);
            });
        });
    }

    run() {
        this.venuesMap.addEventListener('dragend', e => {
            return getVenues(e).then(venues => {
                this.viewModel.update(venues);
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
                });
            });

        });
    }
}
