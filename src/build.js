'use strict';



/**
 * Get icalendar object, one per language
 */
function getIcalendar(path, callback) {

    let languages = ['fr-FR', 'en-US'];

    let fs = require('fs');
    let icalendar = require('icalendar');
    let Ical = require('./ical');

    fs.readFile('./data/'+path, {
        encoding: 'UTF-8'
    }, function (err, data) {
        if (err) {
            throw err;
        }

        let i18next = require('i18next');
        let Backend = require('i18next-node-fs-backend');

        let splited = require('path').basename(path, '.ics').split('-');
        let namespace = splited[splited.length-1];

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

                let filename = require('path').basename(path);

                languages.forEach(function(lang) {
                    callback(new Ical(filename, namespace, icalendar.parse_calendar(data), lang, t));
                });
            });

        });


    });

}


function updateEvents(ical) {

    let specialevents = require('./specialevents');
    let events = ical.icalendar.events();

    for(let funcName in specialevents) {
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
            getIcalendar(filename, ical => {
                updateEvents(ical);
                ical.save();
            });
        });
    });
}


function processUsStates() {
    let states = require('./us-states');
    let latinize = require('latinize');

    states.forEach((state) => {
        getIcalendar('us-all-nonworkingdays.ics', function(ical) {

            updateEvents(ical);

            ical.filter((event) => {
                let categories = event.getProperty('CATEGORIES');
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


/**
 * Markdown for one calendar
 * @param   {String} filename
 * @returns {Promise}
 */
function getCalendarMarkdown(filename) {

    let fs = require('fs');
    let icalendar = require('icalendar');


    const us = '<img src="https://lipis.github.io/flag-icon-css/flags/4x3/us.svg" height="16" />';
    const fr = '<img src="https://lipis.github.io/flag-icon-css/flags/4x3/fr.svg" height="16" />';

    const buildPath = 'https://raw.githubusercontent.com/polo2ro/icsdb/master/build/';

    return new Promise(function(resolve, reject) {

        fs.readFile('./build/en-US/'+filename, {
            encoding: 'UTF-8'
        }, (err, data) => {
            if (err) {
                return reject(err);
            }

            let cal = icalendar.parse_calendar(data);

            let md = cal.getProperty('X-WR-CALNAME').value+'\n';
            md += '<a href="'+buildPath+'en-US/'+filename+'">'+us+'</a>\n';
            md += '<a href="'+buildPath+'fr-FR/'+filename+'">'+fr+'</a>\n';
            md += '\n';
            resolve(md);
        });
    });


}



function createReadme() {
    let fs = require('fs');

    fs.readdir('./build/en-US/', (err, files) => {
        if (err) {
            throw err;
        }

        let chapters = {};

        files.forEach(filename => {
            let f = filename.split('.')[0].split('-');
            let chaptitle = f[0]+' '+f[f.length-1];

            if (undefined === chapters[chaptitle]) {
                chapters[chaptitle] = [];
            }

            chapters[chaptitle].push(filename);
        });

        let md = '';
        let ChapterPromises = [];

        for(let title in chapters) {
            if (chapters.hasOwnProperty(title)) {
                let chapterPromise = new Promise((resolve, reject) => {

                    let promises = [];

                    let chmd = '## '+title+'\n\n';
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
