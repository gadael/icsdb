'use strict';



function getIcalendar(path, callback) {

    var fs = require('fs');
    var icalendar = require('icalendar');

    fs.readFile('./data/'+path, {
        encoding: 'UTF-8'
    }, function (err, data) {
        if (err) {
            throw err;
        }

        var ical = icalendar.parse_calendar(data);

        callback(ical);
    });

}



getIcalendar('fr/nonworkingdays.ics', function(ical) {

    // TODO add all easter dates and Pentecost dates for year interval into RDATES

    console.log(ical.toString());
});
