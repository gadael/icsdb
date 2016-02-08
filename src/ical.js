'use strict';


function Ical(filename, namespace, icalendar, language, t) {

    this.filename = filename;
    this.icalendar = icalendar;
    this.language = language;
    this.namespace = namespace;
    this.t = t;
}


/**
 * Translate strings in icalendar object
 *
 */
Ical.prototype.updateEvents = function translate() {

    let ical = this;

    ical.icalendar.events().forEach(function(event) {

        ical.translateProperty(event, 'SUMMARY');
        ical.translateProperty(event, 'DESCRIPTION');

        event.setProperty('DTSTAMP', new Date());
        event.setProperty('LAST-MODIFIED', new Date());
    });


    let calName = ical.icalendar.getProperty('X-WR-CALNAME');
    if (undefined !== calName.value) {
        ical.icalendar.setProperty('X-WR-CALNAME', ical.t(calName.value, { ns:  ical.namespace, lng: ical.language }));
    }

};


Ical.prototype.filter = function filter(test) {

    let ical = this;
    let icalendar = require('icalendar');
    let filteredCal = new icalendar.iCalendar();


    ical.icalendar.events().forEach(event => {
        if (test(event)) {
            filteredCal.addComponent(event);
        }
    });

    // overwrite current events
    ical.icalendar = filteredCal;
};


Ical.prototype.translateProperty = function translateProperty(event, propName) {

    let t = this.t;

    let property = event.getProperty(propName);
    if (undefined !== property && null !== property.value && '' !== property.value) {
        event.setProperty(propName, t(property.value, { ns:  this.namespace, lng: this.language }));
    }
};



/**
 * Save file to build folder
 * @return {Promise}
 */
Ical.prototype.save = function save(fname) {

    if (undefined === fname) {
        fname = this.filename;
    }

    let fs = require('fs');

    return new Promise((resolve, reject) => {
        fs.writeFile('./build/'+this.language+'/'+fname, this.icalendar.toString(), function(err) {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    });



};


module.exports = Ical;
