import ko from 'knockout';
import template from './template.html!text';

let caseInsensitiveSubstring = (string, allegedSubstring) => {
    return string.toUpperCase().indexOf(allegedSubstring.toUpperCase()) !== -1;
};

/*
 * Data and operations of the search field.
 *
 * The venues' visible property in the main view model are manipulated here
 * allowing the user to show/hide category groups and venues using the search
 * input field.
 *
 * Any component can either bind or subscribe to changes in a venue's visible
 * property to reflect filtering.
 */

class ViewModel {
    constructor(params) {
        this.params = params;

        // Debounce changes in search input.
        this.searchString = ko.observable('').extend({
            rateLimit: {
                method: 'notifyWhenChangesStop',
                timeout: 100
            }
        });

        this.searchString.subscribe(newValue => {
            this.params.categories().forEach(category => {
                if (caseInsensitiveSubstring(category.pluralName, newValue)) {
                    // Category name matches search input; show all venues in
                    // this category.
                    category.venues.forEach(venue => {
                        venue.visible(true);
                    });
                } else {
                    // Category name doesn't match search input; only show those
                    // venues in this category with matching names.
                    category.venues.forEach(venue => {
                        venue.visible(caseInsensitiveSubstring(venue.name, newValue));
                    });
                }
            });
        });

        // Clear search string when a new set of categories is loaded.
        this.params.categories.subscribe(() => {
            this.searchString('');
        });
    }
}

export default {
    viewModel: ViewModel,
    template
};
