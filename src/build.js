'use strict';





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
    let getIcalendar = require('./geticalendar');

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


    let localities = require('./localities');

    let usStates = require('./us-states');
    localities('us-all-nonworkingdays.ics', usStates, updateEvents);

    let germanyStates = require('./germany-states');
    localities('germany-all-nonworkingdays.ics', germanyStates, updateEvents);
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
createReadme();
