/*jshint module: true */
import ko from 'knockout';
import koMapping from 'SteveSanderson/knockout.mapping';

class Venue {
    constructor(spec) {
        this.id = spec.id;
        this.name = spec.name;
        this.location = spec.location;
        this.categories = spec.categories;
        this.visible = ko.observable(true);
    }
}

class Category {
    constructor(spec) {
        this.id = spec.id;
        this.pluralName = spec.pluralName;
        this.venues = spec.venues;
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

    return {
        categories: result
    };
};

let mapping = {
    venues: {
        key: data => ko.utils.unwrapObservable(data.id),
        create: options => new Venue(options.data)
    },
    categories: {
        key: data => ko.utils.unwrapObservable(data.id),
        create: options => new Category(options.data)
    },
    ignore: [ 'confident' ]
};

export default class ViewModel {
    constructor(data) {
        data = data ? data : { venues: [] };

        koMapping.fromJS(data, mapping, this);
        koMapping.fromJS(getCategories(data.venues), mapping, this);

        this.selectedVenue = ko.observable(null);
    }

    update(data) {
        koMapping.fromJS(data, this);
        koMapping.fromJS(getCategories(data.venues), this);
    }

    selectVenue(venue) {
        this.selectedVenue(venue);
    }

    isVenueSelected(venue) {
        return venue === this.selectedVenue();
    }
}
