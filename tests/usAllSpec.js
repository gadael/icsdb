/*global describe: false, it: false */

'use strict';

let assert = require('assert');




describe('United states non working days', function() {


    let IcalFile = require('./icalFile');
    let file = new IcalFile('en-US/us-all-nonworkingdays.ics');



    describe('parse', function() {

        it('get correct number of events', function() {
            let events = file.getNonWorkingDays();
            assert.equal(42, events.length);
        });
    });


    describe('rruleSet tests', function() {


        it('extract new year event date for 2016', function() {

            let rruleSet = file.getRruleSet('b901ca08-d924-43c3-9166-1d215c9453d6');

            let nonworkingdays = rruleSet.between(new Date(2016, 0, 1), new Date(2016, 0, 2), true);


            assert.equal(1, nonworkingdays.length);
            assert.equal(0, nonworkingdays[0].getHours());
        });



        describe('have all events every years', function() {
            let tests = file.getYearIntervalTest();


            tests.forEach(function(test) {
                it(test.summary+' found 1 time in year '+test.y, function() {
                    assert.equal(1, test.count);
                });
            });
        });


    });


});
