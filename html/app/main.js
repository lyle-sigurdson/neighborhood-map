import App from './App';

/*
 * Entry point to the application.
 */

(function () {
    'use strict';

    let app = new App();

    app.init().then(() => {
        app.run();
    });
}());
