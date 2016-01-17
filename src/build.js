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




function updateEaster(events) {

    var util = require('util');
    var dateEaster = require('date-easter');

    var eastermonday = null;
    var pentcostmonday = null;

    events.forEach(function(event) {

        if ('5bd21657-4072-4474-8007-4ffd522fea87' === event.getProperty('UID').value) {
            // Easter monday
            eastermonday = event;
        }

        if ('d0357e64-66d6-4dc2-8442-615b176ea782' === event.getProperty('UID').value) {
            // Pentecost monday
            pentcostmonday = event;
        }
    });

    if (null === eastermonday) {
        throw new Error('Easter monday not found in event list');
    }

    if (null === pentcostmonday) {
        throw new Error('Pentcost monday not found in event list');
    }


    var e, easter, estermondayDates = [];
    var pentcost, pentcostmondayDates = [];

    /**
     * @param {Date} d
     * @return {String}
     */
    function nextMonday(d) {
        var monday = new Date(d);
        monday.setDate(monday.getDate() + 7 + 1 - monday.getDay());
        return monday;
    }

    for (var y = 1900; y< 2100; y++) {
        e = dateEaster.gregorianEaster(y);

        easter = new Date(e.year, e.month-1, e.day);
        pentcost = new Date(easter);
        pentcost.setDate(pentcost.getDate()+50);

        estermondayDates.push(nextMonday(easter));
        pentcostmondayDates.push(nextMonday(pentcost));
    }

    eastermonday.setProperty('RDATE', estermondayDates, { VALUE: 'DATE' });
    pentcostmonday.setProperty('RDATE', pentcostmondayDates, { VALUE: 'DATE' });
}




getIcalendar('french-nonworkingdays.ics', function(ical) {

    // Add all easter dates and Pentecost dates for year interval into RDATES

    updateEaster(ical.icalendar.events());

    ical.updateEvents();
    ical.save();

});
