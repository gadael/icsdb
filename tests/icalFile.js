'use strict';

/**
 * Create the ical file object
 * @param {String} filePath     ex: en-US/france-nonworkingdays.ics
 */
function IcalFile(filePath)
{
    this.filePath = filePath;
}


/**
 * Get non working days
 * @returns {Array} list of events
 */
IcalFile.prototype.getNonWorkingDays = function()
{
    let fs = require('fs');
    let icalendar = require('icalendar');

    let data = fs.readFileSync(
        'build/'+this.filePath,
        { encoding: 'UTF-8' }
    );

    let ical = icalendar.parse_calendar(data);

    return ical.events();
};


/**
 * get event by uid
 * @param   {string} uid
 * @returns {VEvent} event
 */
IcalFile.prototype.getVEvent = function(uid)
{
    let events = this.getNonWorkingDays();
    for(let i=0; i<events.length; i++) {
        if (uid === events[i].getProperty('UID').value) {
            return events[i];
        }
    }

    return null;
};

/**
 * [[Description]]
 * @param   {VEvent} event
 * @returns {RRule}
 */
IcalFile.prototype.getRrule = function(event)
{
    if (undefined === event.getProperty('RRULE')) {
        return null;
    }

    let RRule = require('rrule').RRule;

    let options = RRule.parseString(event.getProperty('RRULE').format()[0].substr(6));
    options.dtstart = event.getProperty('DTSTART').value;

    return new RRule(options);
};


/**
 * Get RRuleSet for one event
 *
 * @param {String} uid VEVENT UID
 */
IcalFile.prototype.getRruleSet = function(uid)
{
    let event = this.getVEvent(uid);
    let rrule = this.getRrule(event);

    let RRuleSet = require('rrule').RRuleSet;

    let rruleSet = new RRuleSet();
    if (null !== rrule) {
        rruleSet.rrule(rrule);
    }

    let rdate = event.getProperty('RDATE');
    if (undefined !== rdate) {

        rdate.value.forEach(function(d) {
            rruleSet.rdate(d);
        });

    }

    return rruleSet;
};


/**
 * Get a table with a list of events for each years, each test contain the number of events found
 * @returns {Array}
 */
IcalFile.prototype.getYearIntervalTest = function()
{
    let events = this.getNonWorkingDays();
    let y, e, from, to, event, rruleSet, nonworkingdays, tests = [];

    for (y=2000; y<2050; y++) {

        from = new Date(y, 0, 1);
        to = new Date(1+y, 0, 1);

        to.setMilliseconds(to.getMilliseconds()-1);

        for (e=0; e<events.length; e++) {

            event = events[e];

            rruleSet = this.getRruleSet(event.getProperty('UID').value);
            nonworkingdays = rruleSet.between(from, to, true);

            tests.push({
                summary: event.getProperty('SUMMARY').value,
                y: y,
                count: nonworkingdays.length
            });
        }
    }

    return tests;
};


module.exports = IcalFile;
