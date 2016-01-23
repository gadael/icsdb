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


    describe('parse', function() {

        it('getNonWorkingDays()', function() {
            var events = getNonWorkingDays();
            assert.equal(10, events.length);
        });
    });


    describe('rrule tests', function() {


        it('extract new year event dates for 2016', function() {

            var event = getVEvent('b901ca08-d924-43c3-9166-1d215c9453d6');

            var rruleProp = event.getProperty('RRULE').value;
            assert.equal(true, rruleProp.hasOwnProperty('FREQ'));
            assert.equal('YEARLY', rruleProp.FREQ);

            var RRule = require('rrule').RRule;

            var options = RRule.parseString(event.getProperty('RRULE').format()[0].substr(6));
            options.dtstart = event.getProperty('DTSTART').value;


            var rrule = new RRule(options);

            var nonworkingdays = rrule.between(new Date(2016, 0, 1), new Date(2016, 0, 2), true);


            assert.equal(1, nonworkingdays.length);
        });


    });


    describe('rdate tests', function() {

        var events = getNonWorkingDays();
    });

});
