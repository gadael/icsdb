'use strict';


/**
 * Get icalendar object, one per language
 */
function getIcalendar(path, callback) {

    var languages = ['en-US','fr-FR'];

    var fs = require('fs');
    var icalendar = require('icalendar');
    var Ical = require('./ical');

    fs.readFile('./data/'+path, {
        encoding: 'UTF-8'
    }, function (err, data) {
        if (err) {
            throw err;
        }

        languages.forEach(function(lang) {
            callback(new Ical(path, icalendar.parse_calendar(data), lang));
        });
    });

}



getIcalendar('french-nonworkingdays.ics', function(ical) {

    // TODO add all easter dates and Pentecost dates for year interval into RDATES

    ical.translate(function() {
        //console.log(ical.icalendar.toString());
    });
});
