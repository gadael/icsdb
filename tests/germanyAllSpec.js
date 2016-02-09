/*global describe: false, it: false */

'use strict';

let assert = require('assert');




describe('Germany non working days', function() {


    let IcalFile = require('./icalFile');
    let file = new IcalFile('en-US/germany-all-nonworkingdays.ics');



    describe('parse', function() {

        it('get correct number of events', function() {
            let events = file.getNonWorkingDays();
            assert.equal(16, events.length);
        });
    });


    describe('rruleSet tests', function() {


        it('extract new year event date for 2016', function() {

            let rruleSet = file.getRruleSet('b901ca08-d924-43c3-9166-1d215c9453d6');

            let nonworkingdays = rruleSet.between(new Date(2016, 0, 1), new Date(2016, 0, 2), true);


            assert.equal(1, nonworkingdays.length);
            assert.equal(0, nonworkingdays[0].getHours());
        });


        it('extract easter monday for 2016', function() {

            let rruleSet = file.getRruleSet('5bd21657-4072-4474-8007-4ffd522fea87');

            let nonworkingdays = rruleSet.between(new Date(2016, 2, 28), new Date(2016, 2, 29), true);

            assert.equal(1, nonworkingdays.length);

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
