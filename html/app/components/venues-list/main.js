import ko from 'knockout';
import template from './template.html!text';

export default class {
    constructor() {
        ko.components.register('venues-list', {
            viewModel: function (params) {
                this.venues = params.venues;
            },
            template: template
        });
    }
}
