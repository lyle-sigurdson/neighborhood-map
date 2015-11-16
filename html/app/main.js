import App from './App';

(function () {
    'use strict';

    let app = new App();

    app.init().then(() => {
        app.run();
    });
}());
