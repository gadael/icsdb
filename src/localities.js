'use strict';

/**
 * Create one file per locality
 * @param   {string}   filename
 * @param   {Array}    states
 * @param   {Function} updateEvents
 * @returns {Promise}
 */
module.exports = function localities(filename, states, updateEvents) {

    let latinize = require('latinize');
    let getIcalendar = require('./geticalendar');

    let promises = [];

    states.forEach((state) => {

        getIcalendar(filename, function(ical) {

            updateEvents(ical);

            ical.filter(event => {

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
            promises.push(ical.save(filename.split('-')[0]+'-'+latinize(state.toLowerCase())+'-nonworkingdays.ics'));
        });
    });

    return Promise.all(promises);
};
