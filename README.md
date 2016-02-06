[![Build Status](https://travis-ci.org/polo2ro/icsdb.svg?branch=master)](https://travis-ci.org/polo2ro/icsdb)

# icsdb

Open repository of static calendar `ICS` files

The purpose of this package is to maintain auto-generated ics files from various sources in the `data/` subfolder. 
For example, the build script will use a source ics file for french non working days, will translate the summaries 
of each events, compute list of easter dates for the next years and save the resulting ics file in the `build/` 
subfolder, one file per language.

## Using the ics files

Use the **raw** button on the github page to get the link, only files in the [build](build/) subfolder should be used.



## Build ics files

dev dependencies are required to rebuild ics with the script

    node src/build.js
    
## Technical notes

some easter based dates require to list all dates because the icalendar spec does not include this kind of properties. the dates are
generated into a RDATE ical property from year 1970 to 2100.

More generally, all recuring dates start from 1970 or more to prevent some bugs while decoding the events with various icalendar libraries.

Similar dates use the same UID property in all calendars

## Others ICS resources

French school holidays

http://www.education.gouv.fr/download.php?file=http%3A%2F%2Fcache.media.education.gouv.fr%2Fics%2FCalendrier_Scolaire_Zones_A_B_C.ics


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/polo2ro/icsdb/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

