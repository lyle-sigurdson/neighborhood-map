import template from './template.html!text';

class ViewModel {
    constructor(params) {
        this.venues = params.venues;
    }
}

export default { viewModel: ViewModel, template };
