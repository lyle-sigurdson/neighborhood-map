/*jshint browser: true */
import template from './template.html!text';

class ViewModel {
    constructor(params) {
        this.categories = params.categories;

        let element$ = window.document.getElementsByClassName(
            'c-venues-by-category'
        );

        // Scroll the venues by category list to the top with each new batch of
        // categories/venues.
        this.categories.subscribe(() => {
            Array.prototype.forEach.call(element$, element => {
                element.scrollTop = 0;
            });
        });
    }
}

export default {
    viewModel: ViewModel,
    template
};
