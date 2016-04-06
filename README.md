[![Build Status](https://travis-ci.org/gadael/icsdb.svg?branch=master)](https://travis-ci.org/gadael/icsdb)

# icsdb

Open repository of static calendar `ICS` files

The purpose of this package is to maintain auto-generated ics files from various sources in the `data/` subfolder. 
For example, the build script will use a source ics file for french non working days, will translate the summaries 
of each events, compute list of easter dates for the next years and save the resulting ics file in the `build/` 
subfolder, one file per language.

## Using the ics files

Use the **raw** button on the github page to get the link, only files in the [build](build/) subfolder should be used.

represented countries:

* Belgium (1 file)
* France (9 files)
* Germany (19 files)
* Ireland (1 file)
* Switzerland (27 files)
* United-Kingdom (3 files)
* United-States (51 files)

Warning, this set of ICS files is suject to move to his own domain in the near future. The github url will probably remain but offical permalinks will be modified

## Build ics files

dev dependencies are required to rebuild ics with the script

    node src/build.js
    
## Usage

some easter based dates require to list all dates because the icalendar spec does not include this kind of properties. the dates are
generated into a RDATE ical property from year 1970 to 2100.

More generally, all recuring dates start from 1970 or more to prevent some bugs while decoding the events with various icalendar libraries.

Similar dates use the same UID property in all calendars.

To interpret these files in a program, You will be required to use a library capable of handling RRULE and RDATE properties. Below is a list of libraries that meet these constraints.

| Language    | Libraries
|-------------|-------------
| javascript  | [rrule](https://github.com/jkbrzt/rrule)<br> [ical.js](https://github.com/polo2ro/ical.js) (support for nodejs in this fork)
| Python      | [dateutil](http://labix.org/python-dateutil/)
| Ruby        | [ri_cal](https://github.com/rubyredrick/ri_cal)
| Haskell     | Not found
| Java        | [ical4j](https://github.com/ical4j/ical4j)


## Others ICS resources

French school holidays

http://www.education.gouv.fr/download.php?file=http%3A%2F%2Fcache.media.education.gouv.fr%2Fics%2FCalendrier_Scolaire_Zones_A_B_C.ics


