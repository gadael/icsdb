'use strict';

/**
 * Get icalendar object, one per language
 */
module.exports = function getIcalendar(path, callback) {

    let languages = ['fr-FR', 'en-US'];

    let fs = require('fs');
    let icalendar = require('icalendar');
    let Ical = require('./ical');

    fs.readFile('./data/'+path, {
        encoding: 'UTF-8'
    }, function (err, data) {
        if (err) {
            throw err;
        }

        let i18next = require('i18next');
        let Backend = require('i18next-node-fs-backend');

        let splited = require('path').basename(path, '.ics').split('-');
        let namespace = splited[splited.length-1];

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

            i18next.loadLanguages(languages, err => {
                if (err) {
                    throw err;
                }

                let filename = require('path').basename(path);

                languages.forEach(function(lang) {
                    callback(new Ical(filename, namespace, icalendar.parse_calendar(data), lang, t));
                });
            });

        });


    });

};
