import App from './App';

(function () {
    'use strict';

    let app = new App();

    app.init().catch(function (err) {
        console.log('err ', err);
    });
}());
