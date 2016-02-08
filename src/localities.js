'use strict';

module.exports = function processUsStates(filename, states, updateEvents) {

    let latinize = require('latinize');
    let getIcalendar = require('./geticalendar');

    states.forEach((state) => {

        getIcalendar(filename, function(ical) {

            updateEvents(ical);

            ical.filter((event) => {

                let categories = event.getProperty('CATEGORIES');
                if (undefined === categories || categories.value.length === 0) {
                    return true;
                }

                if ('-' === categories.value[0][0]) {
                    return (-1 === categories.value.indexOf('-'+state));
                }

                return (-1 !== categories.value.indexOf(state));
            });

            ical.icalendar.setProperty('X-WR-TIMEZONE', 'UTC');
            ical.icalendar.setProperty('X-WR-CALNAME', state+' legal holidays');
            ical.save(filename.split('-')[0]+'-'+latinize(state.toLowerCase())+'-nonworkingdays.ics');
        });
    });
};
