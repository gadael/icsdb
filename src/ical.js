'use strict';


function Ical(namespace, icalendar, language, t) {

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

    var ical = this;

    ical.icalendar.events().forEach(function(event) {

        ical.translateProperty(event, 'SUMMARY');
        ical.translateProperty(event, 'DESCRIPTION');

        event.setProperty('DTSTAMP', new Date());
        event.setProperty('LAST-MODIFIED', new Date());
    });


};


Ical.prototype.translateProperty = function translateProperty(event, propName) {

    var t = this.t;

    var property = event.getProperty(propName);
    if (undefined !== property && null !== property.value && '' !== property.value) {
        event.setProperty(propName, t(property.value, { ns:  this.namespace, lng: this.language }));
    }
};



/**
 * Save file to build folder
 */
Ical.prototype.save = function save() {
    var fs = require('fs');
    fs.writeFile('./build/'+this.language+'/'+this.namespace+'.ics', this.icalendar.toString(), function(err) {
        if (err) {
            throw err;
        }
    });

};


module.exports = Ical;
