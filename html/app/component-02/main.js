import ko from 'knockout';
import template from './template.html!text';
import {} from './style.css!';

export default class {
    constructor(viewModel) {
        ko.components.register('component-02', {
            viewModel: { instance: viewModel },
            template: template
        });
    }
}
