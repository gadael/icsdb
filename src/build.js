'use strict';

var specialevents = require('./specialevents');


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

        var splited = require('path').basename(path, '.ics').split('-');
        var namespace = splited[splited.length-1];

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

                var filename = require('path').basename(path);

                languages.forEach(function(lang) {
                    callback(new Ical(filename, namespace, icalendar.parse_calendar(data), lang, t));
                });
            });

        });


    });

}


function processDataFolder() {
    require('fs').readdir('./data/', function(err, files) {
        if (err) {
            throw err;
        }

        files.forEach(function(filename) {
            getIcalendar(filename, function(ical) {

                var events = ical.icalendar.events();

                for(var funcName in specialevents) {
                    if (specialevents.hasOwnProperty(funcName)) {
                        specialevents[funcName](events, 1970, 2100);
                    }
                }

                ical.updateEvents();
                ical.save();

            });
        });
    });
}


function processUsStates() {
    var states = require('./us-states');
    var latinize = require('latinize');

    states.forEach(function(state) {
        getIcalendar('us-all-nonworkingdays.ics', function(ical) {
            ical.filter(function(event) {
                var categories = event.getProperty('CATEGORIES');
                if (undefined === categories || categories.value.length === 0) {
                    return true;
                }

                if ('-' === categories.value[0][0]) {
                    return (-1 === categories.value.indexOf('-'+state));
                }

                return (-1 !== categories.value.indexOf(state));
            });

            ical.save('us-'+latinize(state.toLowerCase())+'-nonworkingdays.ics');
        });
    });
}



processDataFolder();
processUsStates();
