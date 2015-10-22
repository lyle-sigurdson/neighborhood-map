import ko from 'knockout';
import template from './template.html!text';

export default class {
    constructor() {
        ko.components.register('venues-list', {
            viewModel: params => {
                this.name = params.name;
            },
            template: template
        });
    }
}
