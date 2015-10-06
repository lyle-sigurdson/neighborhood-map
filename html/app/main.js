/*jshint browser: true, devel: true */
import xr from 'radiosilence/xr';
import ko from 'knockout';
import koMapping from 'SteveSanderson/knockout.mapping';

(function () {
    'use strict';

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

    class ViewModel {
        constructor() {
        }

        init(data) {
            koMapping.fromJS(data, mapping, this);
            koMapping.fromJS(getCategories(data.venues), mapping, this);
        }

        update(data) {
            koMapping.fromJS(data, this);
            koMapping.fromJS(getCategories(data.venues), this);
        }
    }

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


    // Main
    let viewModel = new ViewModel();

    xr.get('test-data.json')
        .then(function (result) {
            viewModel.init(result.response);

            ko.applyBindings(viewModel);

            [ 'test-data-one.json', '123-main.json', 'test-data.json' ].forEach((file, index) => {
                setTimeout(() => {
                    xr.get(file).then(data => {
                        viewModel.update(data.response);
                    });
                }, (index + 1) * 5000);
            });
        })
        .catch(function (err) {
            console.log('err ', err);
        });
}());
