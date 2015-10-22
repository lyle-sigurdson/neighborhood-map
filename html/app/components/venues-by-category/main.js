import ko from 'knockout';
import template from './template.html!text';

export default class {
    constructor(viewModel) {
        ko.components.register('venues-by-category', {
            viewModel: { instance: viewModel },
            template
        });
    }
}
