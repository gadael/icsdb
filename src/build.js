'use strict';

var specialevents = require('./specialevents');


/**
 * Get icalendar object, one per language
 */
function getIcalendar(path, callback) {

    var languages = ['fr-FR', 'en-US'];

    var fs = require('fs');
    var icalendar = require('icalendar');
    var Ical = require('./ical');

    fs.readFile('./data/'+path, {
        encoding: 'UTF-8'
    }, function (err, data) {
        if (err) {
            throw err;
        }

        var i18next = require('i18next');
        var Backend = require('i18next-node-fs-backend');

        var splited = require('path').basename(path, '.ics').split('-');
        var namespace = splited[splited.length-1];

        i18next
            .use(Backend)
            .init({
            lng: 'en-US',
            fallbackLng: 'en-US',
            ns: [namespace],
            backend: {
                loadPath: 'i18n/{{lng}}/{{ns}}.json'
            }
        }, function(err, t) {

            if (err) {
                throw err;
            }

            i18next.loadLanguages(languages, err => {
                if (err) {
                    throw err;
                }

                var filename = require('path').basename(path);

                languages.forEach(function(lang) {
                    callback(new Ical(filename, namespace, icalendar.parse_calendar(data), lang, t));
                });
            });

        });


    });

}


function updateEvents(ical) {

    var events = ical.icalendar.events();

    for(var funcName in specialevents) {
        if (specialevents.hasOwnProperty(funcName)) {
            specialevents[funcName](events, 1970, 2100);
        }
    }

    ical.updateEvents();
}


function processDataFolder() {
    require('fs').readdir('./data/', (err, files) => {
        if (err) {
            throw err;
        }

        files.forEach(filename => {
            getIcalendar(filename, function(ical) {
                updateEvents(ical);
                ical.save();

            });
        });
    });
}


function processUsStates() {
    var states = require('./us-states');
    var latinize = require('latinize');

    states.forEach((state) => {
        getIcalendar('us-all-nonworkingdays.ics', function(ical) {

            updateEvents(ical);

            ical.filter((event) => {
                var categories = event.getProperty('CATEGORIES');
                if (undefined === categories || categories.value.length === 0) {
                    return true;
                }

                if ('-' === categories.value[0][0]) {
                    return (-1 === categories.value.indexOf('-'+state));
                }

                return (-1 !== categories.value.indexOf(state));
            });

            ical.icalendar.setProperty('X-WR-TIMEZONE', 'UTC');
            ical.icalendar.setProperty('X-WR-CALNAME', state+' legal holidays');
            ical.save('us-'+latinize(state.toLowerCase())+'-nonworkingdays.ics');
        });
    });
}


function getCalendarMarkdown(filename) {

    var fs = require('fs');
    var icalendar = require('icalendar');


    const us = '<img src="https://lipis.github.io/flag-icon-css/flags/4x3/us.svg" height="16" />';
    const fr = '<img src="https://lipis.github.io/flag-icon-css/flags/4x3/fr.svg" height="16" />';

    const buildPath = 'https://raw.githubusercontent.com/polo2ro/icsdb/master/build/';

    //[![Foo](http://www.google.com.au/images/nav_logo7.png)](http://google.com.au/)

    return new Promise(function(resolve, reject) {

        fs.readFile('./build/en-US/'+filename, {
            encoding: 'UTF-8'
        }, (err, data) => {
            if (err) {
                return reject(err);
            }

            var cal = icalendar.parse_calendar(data);

            var md = cal.getProperty('X-WR-CALNAME').value+'\n';
            md += '<a href="'+buildPath+'en-US/'+filename+'">'+us+'</a>\n';
            md += '<a href="'+buildPath+'fr-FR/'+filename+'">'+fr+'</a>\n';
            md += '\n';
            resolve(md);
        });
    });


}



function createReadme() {
    var fs = require('fs');

    fs.readdir('./build/en-US/', (err, files) => {
        if (err) {
            throw err;
        }

        var chapters = {};

        files.forEach(filename => {
            var f = filename.split('.')[0].split('-');
            var chaptitle = f[0]+' '+f[f.length-1];

            if (undefined === chapters[chaptitle]) {
                chapters[chaptitle] = [];
            }

            chapters[chaptitle].push(filename);
        });

        var md = '';
        var ChapterPromises = [];

        for(var title in chapters) {
            if (chapters.hasOwnProperty(title)) {
                var chapterPromise = new Promise((resolve, reject) => {

                    var promises = [];

                    var chmd = '## '+title+'\n\n';
                    chapters[title].forEach(filename => {
                        promises.push(getCalendarMarkdown(filename));
                    });

                    Promise.all(promises).then(arr => {
                        arr.forEach(fileMd => {
                            chmd += fileMd;
                        });

                        resolve(chmd);
                    });
                });

                ChapterPromises.push(chapterPromise);
            }
        }

        Promise.all(ChapterPromises).then(chapters => {
            chapters.forEach(chapMd => {
                md += chapMd+'\n\n';
            });



            fs.writeFile('./build/README.md', md, (err) => {
                if (err) {
                    throw err;
                }
            });
        });

    });
}



processDataFolder();
processUsStates();
createReadme();
