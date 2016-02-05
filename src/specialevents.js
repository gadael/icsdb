'use strict';

var dateEaster = require('date-easter');


function getEventByUid(events, uid) {

    var e = null;

    events.forEach(function(event) {

        if (uid === event.getProperty('UID').value) {
            // Easter monday
            e = event;
        }
    });

    return e;

}

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
function updateMardiGras(events, from, to) {

    var mardigras = getEventByUid(events, '7ac45e93-a684-4061-a0c7-948a89e358b0');

    if (null === mardigras) {
        return;
    }


    var e, easter, mardigrasDates = [];


    for (var y = from; y< to; y++) {
        e = dateEaster.gregorianEaster(y);
        easter = new Date(e.year, e.month-1, e.day);
        easter.setDate(easter.getDate()-47);
        mardigrasDates.push(easter);
    }

    mardigras.setProperty('RDATE', mardigrasDates, { VALUE: 'DATE' });
}



/**
 * @param {Array} events
 * @param {Integer} from    Year
 * @param {Integer} to      Year
 */
function updateGoodFriday(events, from, to) {

    var goodfriday = getEventByUid(events, '3c46243f-00f8-418f-94cf-4eda72ae7cb2');

    if (null === goodfriday) {
        return;
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

    var eastermonday = getEventByUid(events, '5bd21657-4072-4474-8007-4ffd522fea87');

    if (null === eastermonday) {
        return;
    }


    var e, easter, estermondayDates = [];


    for (var y = from; y< to; y++) {
        e = dateEaster.gregorianEaster(y);

        easter = new Date(e.year, e.month-1, e.day);
        estermondayDates.push(nextMonday(easter));
    }

    eastermonday.setProperty('RDATE', estermondayDates, { VALUE: 'DATE' });
}



function updateAscent(events, from, to) {
    var ascent = getEventByUid(events, '6dd38994-93cf-4f92-96ff-0d3af8b08276');

    if (null === ascent) {
        return;
    }

    var e, easterAnd40, ascentDates = [];

    for (var y = from; y< to; y++) {
        e = dateEaster.gregorianEaster(y);

        easterAnd40 = new Date(e.year, e.month-1, e.day);
        easterAnd40.setDate(easterAnd40.getDate()+40);
        ascentDates.push(easterAnd40);
    }

    ascent.setProperty('RDATE', ascentDates, { VALUE: 'DATE' });
}



/**
 * @param {Array} events
 * @param {Integer} from    Year
 * @param {Integer} to      Year
 */
function updatePentcostMonday(events, from, to) {

    var pentcostmonday = getEventByUid(events, 'd0357e64-66d6-4dc2-8442-615b176ea782');

    if (null === pentcostmonday) {
        return;
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




function updateAfterThanksgiving(events, from, to) {

    function getThanksGiving(year) {
        var first = new Date(year, 10, 1);
        return (22 + (11 - first.getDay()) % 7);
    }

    var afterThanksgiving = getEventByUid(events, '68774dca-ca04-4d39-be28-4401d2dce8af');

    if (null === afterThanksgiving) {
        return;
    }

    var serie = [];

    for (var y = from; y< to; y++) {
        serie.push(new Date(y, 10, 1+ getThanksGiving(y)));
    }

    afterThanksgiving.setProperty('RDATE', serie, { VALUE: 'DATE' });
}



module.exports = {
    updateMardiGras: updateMardiGras,
    updateGoodFriday: updateGoodFriday,
    updateEasterMonday: updateEasterMonday,
    updatePentcostMonday: updatePentcostMonday,
    updateAscent: updateAscent,
    updateAfterThanksgiving: updateAfterThanksgiving
};
