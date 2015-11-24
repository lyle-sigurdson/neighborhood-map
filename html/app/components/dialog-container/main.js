import template from './template.html!text';

/*
 * A list of errors from the main view model.
 */
class ViewModel {
    constructor(params) {
        this.errors = params.errors;
    }
}

export default {
    viewModel: ViewModel,
    template
};
