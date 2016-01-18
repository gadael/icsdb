'use strict';


/**
 * @param {Array} events
 * @param {Integer} from    Year
 * @param {Integer} to      Year
 */
function updateEaster(events, from, to) {

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

    for (var y = from; y< to; y++) {
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


module.exports = {
    updateEaster: updateEaster
};
