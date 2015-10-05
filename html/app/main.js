/*jshint browser: true, devel: true */
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
        venues: {
            key: data => ko.utils.unwrapObservable(data.id),
            create: options => new Venue(options.data)
        },
        categories: {
            key: data => ko.utils.unwrapObservable(data.id),
            create: options => new Category(options.data)
        }
    };

    let getCategories = (venues) => {
        let categories = new Map(),
            result = [];

        venues.forEach(venue =>
            venue.categories.forEach(category =>
                categories.set(category.id, category)
            )
        );

        categories.forEach((value) =>
            result.push(value)
        );

        return result;
    };

    xr.get('test-data.json')
        .then(function (result) {
            let data = {
                venues: result.response.venues,
                categories: getCategories(result.response.venues)
            };

            let viewModel = koMapping.fromJS(data, mapping);

            ko.applyBindings(viewModel);

            [ 'test-data-one.json', '123-main.json', 'test-data.json' ].forEach((file, index) => {
                setTimeout(() => {
                    console.log(index);
                    xr.get(file).then(result => {
                        let data = {
                            venues: result.response.venues,
                            categories: getCategories(result.response.venues)
                        };
                        koMapping.fromJS(data, viewModel);
                    });
                }, (index + 1) * 5000);
            });
        })
        .catch(function (err) {
            console.log('err ', err);
        });
}());
