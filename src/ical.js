'use strict';


let missing = [];


function Ical(filename, namespace, icalendar, language, t) {

    this.filename = filename;
    this.icalendar = icalendar;
    this.language = language;
    this.namespace = namespace;
    this.t = t;
}


Ical.prototype.translate = function(text, options) {

    let translated = this.t(text, options);

    if (translated === text && options.lng !== 'en-US' && -1 === missing.indexOf(text)) {
        console.warn('Missing translation: "'+text+'"');
        missing.push(text);
    }

    return translated;
};


/**
 * Translate strings in icalendar object
 *
 */
Ical.prototype.updateEvents = function updateEvents() {

    let ical = this;

    ical.icalendar.events().forEach(function(event) {

        ical.translateProperty(event, 'SUMMARY');
        ical.translateProperty(event, 'DESCRIPTION');

        event.setProperty('DTSTAMP', new Date());
        event.setProperty('LAST-MODIFIED', new Date());
    });


    let calName = ical.icalendar.getProperty('X-WR-CALNAME');
    if (undefined !== calName.value) {
        ical.icalendar.setProperty('X-WR-CALNAME', ical.translate(calName.value, { ns:  ical.namespace, lng: ical.language }));
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

    let ical = this;

    let property = event.getProperty(propName);
    if (undefined !== property && null !== property.value && '' !== property.value) {
        event.setProperty(propName, ical.translate(property.value, { ns:  this.namespace, lng: this.language }));
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
