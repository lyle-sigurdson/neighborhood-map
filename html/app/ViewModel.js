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

    categories.forEach((value) =>
        result.push(value)
    );

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
    }
};

export default class ViewModel {
    constructor(data) {
        data = data ? data : { venues: [] };

        koMapping.fromJS(data, mapping, this);
        koMapping.fromJS(getCategories(data.venues), mapping, this);
    }

    update(data) {
        koMapping.fromJS(data, this);
        koMapping.fromJS(getCategories(data.venues), this);
    }
}
