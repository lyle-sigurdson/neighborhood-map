/*global console */
import xr from 'radiosilence/xr';
import ko from 'knockout';
import koMapping from 'SteveSanderson/knockout.mapping';

(function () {
    'use strict';

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

    let mapping = {
        ignore: [ 'confident' ],
        venues: {
            key: data => ko.utils.unwrapObservable(data.id),
            create: options => new Venue(options.data)
        },
        categories: {
            key: data => ko.utils.unwrapObservable(data.id),
            create: options => new Category(options.data)
        }
    };

    xr.get('test-data.json')
        .then(function (result) {
            let categories = new Map();

            result.response.venues.forEach(venue =>
                venue.categories.forEach(category =>
                    categories.set(category.id, category)
                )
            );

            result.response.categories = [];

            categories.forEach((value) =>
                result.response.categories.push(value)
            );

            let viewModel = koMapping.fromJS(result.response, mapping);

            ko.applyBindings(viewModel);

            console.log(viewModel);

        })
        .catch(function (err) {
            console.log('err ', err);
        });
}());
