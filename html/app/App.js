import ko from 'knockout';

import ViewModel from './ViewModel';
import Component01 from './components/component-01/main';
import VenuesMap from './components/venues-map/main';

export default class {
    constructor() {
        this.viewModel = new ViewModel();
        this.component01 = new Component01(this.viewModel);
        this.venuesMap = new VenuesMap(this.viewModel);
        ko.applyBindings(this.viewModel);
    }

    init() {
        return this.venuesMap.init().then(() => {
            this.venuesMap.addEventListener('dragend', e => {
                console.log('dragend', e);
            });
        });
    }
}
