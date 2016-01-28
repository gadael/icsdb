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
    var fs = require('fs');
    var icalendar = require('icalendar');

    var data = fs.readFileSync(
        'build/'+this.filePath,
        { encoding: 'UTF-8' }
    );

    var ical = icalendar.parse_calendar(data);

    return ical.events();
};


/**
 * get event by uid
 * @param   {string} uid
 * @returns {VEvent} event
 */
IcalFile.prototype.getVEvent = function(uid)
{
    var events = this.getNonWorkingDays();
    for(var i=0; i<events.length; i++) {
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

    var RRule = require('rrule').RRule;

    var options = RRule.parseString(event.getProperty('RRULE').format()[0].substr(6));
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
    var event = this.getVEvent(uid);
    var rrule = this.getRrule(event);

    var RRuleSet = require('rrule').RRuleSet;

    var rruleSet = new RRuleSet();
    if (null !== rrule) {
        rruleSet.rrule(rrule);
    }

    var rdate = event.getProperty('RDATE');
    if (undefined !== rdate) {

        rdate.value.forEach(function(d) {
            rruleSet.rdate(d);
        });

    }

    return rruleSet;
};


module.exports = IcalFile;
