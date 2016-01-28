/*global describe: false, it: false */

'use strict';

var assert = require('assert');




describe('French non working days', function() {


    var IcalFile = require('./icalFile');
    var file = new IcalFile('en-US/france-nonworkingdays.ics');



    describe('parse', function() {

        it('getNonWorkingDays()', function() {
            var events = file.getNonWorkingDays();
            assert.equal(10, events.length);
        });
    });


    describe('rruleSet tests', function() {


        it('extract new year event dates for 2016', function() {

            var rruleSet = file.getRruleSet('b901ca08-d924-43c3-9166-1d215c9453d6');

            var nonworkingdays = rruleSet.between(new Date(2016, 0, 1), new Date(2016, 0, 2), true);


            assert.equal(1, nonworkingdays.length);
            assert.equal(0, nonworkingdays[0].getHours());
        });


        it('extract easter monday for 2016', function() {

            var rruleSet = file.getRruleSet('5bd21657-4072-4474-8007-4ffd522fea87');

            var nonworkingdays = rruleSet.between(new Date(2016, 2, 28), new Date(2016, 2, 29), true);

            assert.equal(1, nonworkingdays.length);

        });


    });


});
