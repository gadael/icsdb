'use strict';


/**
 * Get icalendar object, one per language
 */
function getIcalendar(path, callback) {

    var languages = ['fr-FR', 'en-US'];

    var fs = require('fs');
    var icalendar = require('icalendar');
    var Ical = require('./ical');

    fs.readFile('./data/'+path, {
        encoding: 'UTF-8'
    }, function (err, data) {
        if (err) {
            throw err;
        }

        var i18next = require('i18next');
        var Backend = require('i18next-node-fs-backend');

        var namespace = require('path').basename(path, '.ics');

        i18next
            .use(Backend)
            .init({
            lng: 'en-US',
            fallbackLng: 'en-US',
            ns: [namespace],
            backend: {
                loadPath: 'i18n/{{lng}}/{{ns}}.json'
            }
        }, function(err, t) {

            if (err) {
                throw err;
            }

            i18next.loadLanguages(languages, function(err) {
                if (err) {
                    throw err;
                }

                languages.forEach(function(lang) {
                    callback(new Ical(namespace, icalendar.parse_calendar(data), lang, t));
                });
            });

        });


    });

}



getIcalendar('french-nonworkingdays.ics', function(ical) {

    // TODO add all easter dates and Pentecost dates for year interval into RDATES

    ical.updateEvents();
    ical.save();

});
