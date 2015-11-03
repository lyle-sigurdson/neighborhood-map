/*jshint module: true */
import ko from 'knockout';
import koMapping from 'SteveSanderson/knockout.mapping';
import assignCategoryColors from './assignCategoryColors';

class Venue {
    constructor(spec) {
        this.id = spec.id;
        this.name = spec.name;
        this.location = spec.location;
        this.contact = spec.contact;
        this.visible = ko.observable(true);
    }
}

class Category {
    constructor(spec) {
        this.id = spec.id;
        this.pluralName = spec.pluralName;
        this.color = spec.color;
        this.icon = spec.icon;
        this.venues = spec.venues.map((venue) => {
            return new Venue(venue);
        });
        this.visible = ko.computed(() => {
            return this.venues.some(venue => {
                return venue.visible();
            });
        });
    }
}

let getCategories = (venues) => {
    let categories = new Map();

    venues.forEach(venue =>
        venue.categories.forEach(category =>
            categories.set(category.id, category)
        )
    );


    let result = [];

    categories.forEach(outerCategory => {
        outerCategory.venues = [];
        venues.forEach(venue => {
            venue.categories.forEach(category => {
                if (outerCategory.id === category.id) {
                    outerCategory.venues.push(venue);
                }
            });
        });
        result.push(outerCategory);
    });

    assignCategoryColors(result);

    return {
        categories: result
    };
};

let mapping = {
    categories: {
        create: options => new Category(options.data)
    },
    ignore: [ 'confident' ]
};

export default class ViewModel {
    constructor(data) {
        data = data ? data : { venues: [] };

        koMapping.fromJS(getCategories(data.venues), mapping, this);

        this.selectedVenue = ko.observable(null);
    }

    update(data) {
        koMapping.fromJS(getCategories(data.venues), this);
    }

    selectVenue(venue) {
        this.selectedVenue(venue);
    }

    isVenueSelected(venue) {
        return venue === this.selectedVenue();
    }
}
