import template from './template.html!text';

class ViewModel {
    constructor(params) {
        this.categories = params.categories;
    }
}

export default {
    viewModel: ViewModel,
    template
};
