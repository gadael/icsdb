'use strict';

let dateEaster = require('date-easter');


function getEventByUid(events, uid) {

    let e = null;

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
    let monday = new Date(d);
    monday.setDate(monday.getDate() + (1 + 7 - monday.getDay()) % 7);
    return monday;
}








/**
 * @param {Array} events
 * @param {Integer} from    Year
 * @param {Integer} to      Year
 */
function updateMardiGras(events, from, to) {

    let mardigras = getEventByUid(events, '7ac45e93-a684-4061-a0c7-948a89e358b0');

    if (null === mardigras) {
        return;
    }


    let e, easter, mardigrasDates = [];


    for (let y = from; y< to; y++) {
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
function updateMaudyThursday(events, from, to)
{


    let maudyThursday = getEventByUid(events, '8986cec1-8713-46ac-83a5-1b07fd9b2cf6');

    if (null === maudyThursday) {
        return;
    }


    let e, easter, maudyDates = [];


    for (let y = from; y< to; y++) {
        e = dateEaster.gregorianEaster(y);
        easter = new Date(e.year, e.month-1, e.day);
        easter.setDate(easter.getDate()-4);
        maudyDates.push(easter);
    }

    maudyThursday.setProperty('RDATE', maudyDates, { VALUE: 'DATE' });
}



/**
 * @param {Array} events
 * @param {Integer} from    Year
 * @param {Integer} to      Year
 */
function updateGoodFriday(events, from, to) {

    let goodfriday = getEventByUid(events, '3c46243f-00f8-418f-94cf-4eda72ae7cb2');

    if (null === goodfriday) {
        return;
    }


    let e, easter, goodfridayDates = [];


    for (let y = from; y< to; y++) {
        e = dateEaster.gregorianEaster(y);
        easter = new Date(e.year, e.month-1, e.day);
        easter.setDate(easter.getDate()-3);
        goodfridayDates.push(easter);
    }

    goodfriday.setProperty('RDATE', goodfridayDates, { VALUE: 'DATE' });
}


function updateHolySaturday(events, from, to) {

    let holySaturday = getEventByUid(events, '540f945f-864c-46ad-b72d-caeeb32b7b21');

    if (null === holySaturday) {
        return;
    }


    let e, easter, holyDates = [];


    for (let y = from; y< to; y++) {
        e = dateEaster.gregorianEaster(y);
        easter = new Date(e.year, e.month-1, e.day);
        easter.setDate(easter.getDate()-2);
        holyDates.push(easter);
    }

    holySaturday.setProperty('RDATE', holyDates, { VALUE: 'DATE' });
}




/**
 * @param {Array} events
 * @param {Integer} from    Year
 * @param {Integer} to      Year
 */
function updateEasterMonday(events, from, to) {

    let eastermonday = getEventByUid(events, '5bd21657-4072-4474-8007-4ffd522fea87');

    if (null === eastermonday) {
        return;
    }


    let e, easter, estermondayDates = [];


    for (let y = from; y< to; y++) {
        e = dateEaster.gregorianEaster(y);

        easter = new Date(e.year, e.month-1, e.day);
        estermondayDates.push(nextMonday(easter));
    }

    eastermonday.setProperty('RDATE', estermondayDates, { VALUE: 'DATE' });
}



function updateAscent(events, from, to) {
    let ascent = getEventByUid(events, '6dd38994-93cf-4f92-96ff-0d3af8b08276');

    if (null === ascent) {
        return;
    }

    let e, easterAnd39, ascentDates = [];

    for (let y = from; y< to; y++) {
        e = dateEaster.gregorianEaster(y);

        easterAnd39 = new Date(e.year, e.month-1, e.day);
        easterAnd39.setDate(easterAnd39.getDate()+39);
        ascentDates.push(easterAnd39);
    }

    ascent.setProperty('RDATE', ascentDates, { VALUE: 'DATE' });
}



/**
 * @param {Array} events
 * @param {Integer} from    Year
 * @param {Integer} to      Year
 */
function updatePentcostMonday(events, from, to) {

    let pentcostmonday = getEventByUid(events, 'd0357e64-66d6-4dc2-8442-615b176ea782');

    if (null === pentcostmonday) {
        return;
    }


    let e, easter;
    let pentcost, pentcostmondayDates = [];


    for (let y = from; y< to; y++) {
        e = dateEaster.gregorianEaster(y);

        easter = new Date(e.year, e.month-1, e.day);
        pentcost = new Date(easter);
        pentcost.setDate(pentcost.getDate()+50);

        pentcostmondayDates.push(nextMonday(pentcost));
    }

    pentcostmonday.setProperty('RDATE', pentcostmondayDates, { VALUE: 'DATE' });
}



/**
 * @param {Array} events
 * @param {Integer} from    Year
 * @param {Integer} to      Year
 */
function updateCorpusChristi(events, from, to) {

    let corpuschristiEvent = getEventByUid(events, '6e008a20-cdd7-11e5-a837-0800200c9a66');

    if (null === corpuschristiEvent) {
        return;
    }


    let e, easter;
    let corpusChristi, corpusChristiDates = [];


    for (let y = from; y< to; y++) {
        e = dateEaster.gregorianEaster(y);

        easter = new Date(e.year, e.month-1, e.day);
        corpusChristi = new Date(easter);
        corpusChristi.setDate(corpusChristi.getDate()+60);

        corpusChristiDates.push(nextMonday(corpusChristi));
    }

    corpuschristiEvent.setProperty('RDATE', corpusChristiDates, { VALUE: 'DATE' });
}




function updateAfterThanksgiving(events, from, to) {

    function getThanksGiving(year) {
        let first = new Date(year, 10, 1);
        return (22 + (11 - first.getDay()) % 7);
    }

    let afterThanksgiving = getEventByUid(events, '68774dca-ca04-4d39-be28-4401d2dce8af');

    if (null === afterThanksgiving) {
        return;
    }

    let serie = [];

    for (let y = from; y< to; y++) {
        serie.push(new Date(y, 10, 1+ getThanksGiving(y)));
    }

    afterThanksgiving.setProperty('RDATE', serie, { VALUE: 'DATE' });
}



module.exports = {
    updateMardiGras: updateMardiGras,
    updateMaudyThursday: updateMaudyThursday,
    updateGoodFriday: updateGoodFriday,
    updateHolySaturday: updateHolySaturday,
    updateEasterMonday: updateEasterMonday,
    updatePentcostMonday: updatePentcostMonday,
    updateAscent: updateAscent,
    updateCorpusChristi: updateCorpusChristi,
    updateAfterThanksgiving: updateAfterThanksgiving
};
