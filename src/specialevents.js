'use strict';

var dateEaster = require('date-easter');


/**
 * @param {Date} d
 * @return {String}
 */
function nextMonday(d) {
    var monday = new Date(d);
    monday.setDate(monday.getDate() + 1 + monday.getDay());
    return monday;
}



/**
 * @param {Array} events
 * @param {Integer} from    Year
 * @param {Integer} to      Year
 */
function updateGoodFriday(events, from, to) {

    var goodfriday = null;

    events.forEach(function(event) {

        if ('3c46243f-00f8-418f-94cf-4eda72ae7cb2' === event.getProperty('UID').value) {
            // Easter monday
            goodfriday = event;
        }
    });

    if (null === goodfriday) {
        throw new Error('Good friday not found in event list');
    }


    var e, easter, goodfridayDates = [];


    for (var y = from; y< to; y++) {
        e = dateEaster.gregorianEaster(y);
        easter = new Date(e.year, e.month-1, e.day);
        easter.setDate(easter.getDate()-3);
        goodfridayDates.push(easter);
    }

    goodfriday.setProperty('RDATE', goodfridayDates, { VALUE: 'DATE' });
}




/**
 * @param {Array} events
 * @param {Integer} from    Year
 * @param {Integer} to      Year
 */
function updateEasterMonday(events, from, to) {

    var eastermonday = null;


    events.forEach(function(event) {

        if ('5bd21657-4072-4474-8007-4ffd522fea87' === event.getProperty('UID').value) {
            // Easter monday
            eastermonday = event;
        }

    });

    if (null === eastermonday) {
        throw new Error('Easter monday not found in event list');
    }


    var e, easter, estermondayDates = [];


    for (var y = from; y< to; y++) {
        e = dateEaster.gregorianEaster(y);

        easter = new Date(e.year, e.month-1, e.day);
        estermondayDates.push(nextMonday(easter));
    }

    eastermonday.setProperty('RDATE', estermondayDates, { VALUE: 'DATE' });
}



/**
 * @param {Array} events
 * @param {Integer} from    Year
 * @param {Integer} to      Year
 */
function updatePentcostMonday(events, from, to) {

    var pentcostmonday = null;

    events.forEach(function(event) {

        if ('d0357e64-66d6-4dc2-8442-615b176ea782' === event.getProperty('UID').value) {
            // Pentecost monday
            pentcostmonday = event;
        }
    });

    if (null === pentcostmonday) {
        throw new Error('Pentcost monday not found in event list');
    }


    var e, easter;
    var pentcost, pentcostmondayDates = [];


    for (var y = from; y< to; y++) {
        e = dateEaster.gregorianEaster(y);

        easter = new Date(e.year, e.month-1, e.day);
        pentcost = new Date(easter);
        pentcost.setDate(pentcost.getDate()+50);

        pentcostmondayDates.push(nextMonday(pentcost));
    }

    pentcostmonday.setProperty('RDATE', pentcostmondayDates, { VALUE: 'DATE' });
}


module.exports = {
    updateGoodFriday: updateGoodFriday,
    updateEasterMonday: updateEasterMonday,
    updatePentcostMonday: updatePentcostMonday
};
