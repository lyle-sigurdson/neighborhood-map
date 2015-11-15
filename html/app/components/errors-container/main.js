import template from './template.html!text';

class ViewModel {
    constructor(params) {
        this.errors = params.errors;
    }
}

export default {
    viewModel: ViewModel,
    template
};
