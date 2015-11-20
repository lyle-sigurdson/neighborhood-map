import ko from 'knockout';
import template from './template.html!text';

let caseInsensitiveSubstring = (string, allegedSubstring) => {
    return string.toUpperCase().indexOf(allegedSubstring.toUpperCase()) !== -1;
};

class ViewModel {
    constructor(params) {
        this.params = params;

        this.searchString = ko.observable('').extend({
            rateLimit: {
                method: 'notifyWhenChangesStop',
                timeout: 100
            }
        });

        this.searchString.subscribe(newValue => {
            this.params.categories().forEach(category => {
                if (caseInsensitiveSubstring(category.pluralName, newValue)) {
                    category.venues.forEach(venue => {
                        venue.visible(true);
                    });
                } else {
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
