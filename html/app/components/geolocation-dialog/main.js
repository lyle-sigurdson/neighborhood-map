import ko from 'knockout';

import ViewModel from './ViewModel.js';
import template from './template.html!text';
import {} from './style.css!';

export default class {
    constructor() {
        this.viewModel = new ViewModel();

        ko.components.register('geolocation-dialog', {
            viewModel: { instance: this.viewModel },
            template: template
        });
    }

    show() {
        this.viewModel.show();
        return new Promise(
            this.viewModel.result.subscribe.bind(this.viewModel.result)
        );
    }

    hide() {
        this.viewModel.hide();
    }
}
