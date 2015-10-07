/*jshint browser: true, devel: true */
import xr from 'radiosilence/xr';

import ViewModel from './ViewModel';

import Component01 from 'app/components/component-01/main';
import VenuesMap from 'app/components/venues-map/main';

(function () {
    'use strict';
    xr.get('test-data.json')
        .then(function (result) {
            // Init the app.
            let viewModel = new ViewModel(result.response);

            let component01 = new Component01(viewModel);
            let venuesMap = new VenuesMap(viewModel);

            ko.applyBindings(viewModel);

            // Apply updates as necessary.
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
