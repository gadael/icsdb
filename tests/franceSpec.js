/*global describe: false, it: false */

'use strict';

var assert = require('assert');




describe('French non working days', function() {


    /**
     * Get non working days
     * @returns {Array} list of events
     */
    function getNonWorkingDays()
    {
        var fs = require('fs');
        var icalendar = require('icalendar');

        var data = fs.readFileSync(
            'build/en-US/france-nonworkingdays.ics',
            { encoding: 'UTF-8' }
        );

        var ical = icalendar.parse_calendar(data);

        return ical.events();
    }


    /**
     * get event by uid
     * @param   {string} uid
     * @returns {VEvent} event
     */
    function getVEvent(uid)
    {
        var events = getNonWorkingDays();
        for(var i=0; i<events.length; i++) {
            if (uid === events[i].getProperty('UID').value) {
                return events[i];
            }
        }

        return null;
    }

    /**
     * [[Description]]
     * @param   {VEvent} event
     * @returns {RRule}
     */
    function getRrule(event)
    {
        if (undefined === event.getProperty('RRULE')) {
            return null;
        }

        var RRule = require('rrule').RRule;

        var options = RRule.parseString(event.getProperty('RRULE').format()[0].substr(6));
        options.dtstart = event.getProperty('DTSTART').value;

        return new RRule(options);
    }


    /**
     * Get RRuleSet for one event
     *
     * @param {String} uid VEVENT UID
     */
    function getRruleSet(uid)
    {
        var event = getVEvent(uid);
        var rrule = getRrule(event);

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
    }



    describe('parse', function() {

        it('getNonWorkingDays()', function() {
            var events = getNonWorkingDays();
            assert.equal(10, events.length);
        });
    });


    describe('rrule tests', function() {


        it('extract new year event dates for 2016', function() {

            var rruleSet = getRruleSet('b901ca08-d924-43c3-9166-1d215c9453d6');

            var nonworkingdays = rruleSet.between(new Date(2016, 0, 1), new Date(2016, 0, 2), true);


            assert.equal(1, nonworkingdays.length);
            assert.equal(0, nonworkingdays[0].getHours());
        });


        it('extract easter monday for 2016', function() {

            var rruleSet = getRruleSet('5bd21657-4072-4474-8007-4ffd522fea87');

            var nonworkingdays = rruleSet.between(new Date(2016, 2, 28), new Date(2016, 2, 29), true);

            assert.equal(1, nonworkingdays.length);

        });


    });


    describe('rdate tests', function() {

        var events = getNonWorkingDays();
    });

});
