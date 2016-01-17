'use strict';


function Ical(path, icalendar, language) {



    this.path = path;
    this.icalendar = icalendar;
    this.language = language;

}

Ical.prototype.translate = function translate(callback) {

    var ical = this;

    var i18next = require('i18next');
    var Backend = require('i18next-node-fs-backend');

    var path = require('path');

    var namespace = path.basename(ical.path, '.ics');



    i18next
        .use(Backend)
        .init({
        lng: ical.language,
        'defaultNS': namespace,
        'backend': {
            'loadPath': 'i18n/{{lng}}/{{ns}}.json'
        }
    }, function(err, t) {

        console.log(err);

        ical.icalendar.events().forEach(function(event) {

            ical.translateProperty(event, 'SUMMARY', t);
            ical.translateProperty(event, 'DESCRIPTION', t);
        });

        callback();
    });
};


Ical.prototype.translateProperty = function translateProperty(event, propName, t) {

    var i18next = require('i18next');

    var property = event.getProperty(propName);
    if (undefined !== property && null !== property.value && '' !== property.value) {
        event.setProperty(propName, i18next.t(property.value));
        console.log(i18next.t(property.value));
    }
};



/**
 * Save file to build folder
 */
Ical.prototype.save = function save() {

};


module.exports = Ical;
