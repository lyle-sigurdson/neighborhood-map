/*jshint browser: true */

export default class {
    constructor(sentinal, defaults) {
        this.listeners = {};

        if (!window.localStorage.getItem(sentinal)) {
            // Nothing stored; set sentinal value and load default preferences.
            window.localStorage.setItem(sentinal, '__preferences_sentinal__');
            Object.keys(defaults).forEach(preference => {
                window.localStorage.setItem(
                    preference, JSON.stringify(defaults[preference])
                );
            });
        }
    }


    setItem(item, newValue) {
        const oldValueString = window.localStorage.getItem(item),
              newValueString = JSON.stringify(newValue);

        if (oldValueString === newValueString) {
            return;
        }

        window.localStorage.setItem(item, newValueString);

        if (this.listeners[item]) {
            this.listeners[item].forEach(listener => {
                listener.call(this, {
                    oldValue: JSON.parse(oldValueString),
                    newValue
                });
            });
        }
    }


    getItem(item) {
        return JSON.parse(window.localStorage.getItem(item));
    }


    addEventListener(item, f) {
        if (this.listeners[item]) {
            this.listeners[item].push(f);
        } else {
            this.listeners[item] = [ f ];
        }
    }
}
