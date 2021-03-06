import ko from 'knockout';

/*
 * Data and operations on the geolocation dialog.
 */

export default class {
    constructor() {
        this.visible = ko.observable(false);
        this.result = ko.observable('');
    }

    show() {
        this.visible(true);
    }

    hide() {
        this.visible(false);
    }

    yes() {
        this.result('yes');
    }

    no() {
        this.result('no');
    }

    never() {
        this.result('never');
    }
}
