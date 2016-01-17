'use strict';


function Ical(path, icalendar, language) {



    this.path = path;
    this.icalendar = icalendar;
    this.language = language;
    this.namespace = require('path').basename(path, '.ics');
}


/**
 * Translate strings in icalendar object
 * @param {Function} callback
 */
Ical.prototype.translate = function translate(callback) {

    var ical = this;

    var i18next = require('i18next');
    var Backend = require('i18next-node-fs-backend');


    i18next
        .use(Backend)
        .init({
        lng: ical.language,
        fallbackLng: 'en-US',
        ns: ['french-nonworkingdays'],
        backend: {
            loadPath: 'i18n/{{lng}}/{{ns}}.json'
        }
    }, function(err, t) {

        if (err) {
            throw err;
        }

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
        //event.setProperty(propName, i18next.t(property.value, { ns:  this.namespace }));
        console.log(t(property.value, { ns:  this.namespace, lng: this.language })+' '+this.language);
    }
};



/**
 * Save file to build folder
 */
Ical.prototype.save = function save() {

};


module.exports = Ical;
