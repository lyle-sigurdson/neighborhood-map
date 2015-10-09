import ko from 'knockout';

import ViewModel from './ViewModel';
import Component01 from './components/component-01/main';
import VenuesMap from './components/venues-map/main';

import getVenues from './getVenues';
import getIpinfo from './getIpinfo';

export default class {
    constructor() {
        this.viewModel = new ViewModel();
        this.component01 = new Component01(this.viewModel);
        this.venuesMap = new VenuesMap(this.viewModel);
        ko.applyBindings(this.viewModel);
    }

    init() {
        let initTasks = [ getIpinfo(), this.venuesMap.init() ];

        return Promise.all(initTasks).then(results => {
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
    }
}
