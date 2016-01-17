# icsdb

Open repository of usefull calendar ics files

The purpose of this package is to maintain auto-generated ics files from various sources in the `data/` subfolder. 
For example, the build script will use a source ics file for french non working days, will translate the summaries 
of each events, compute list of easter dates for the next years and save the resulting ics file in the `build/` 
subfolder, one file per language.

## Using the ics files

Use the **raw** button on the github page to get the link, only files in the build subfolder should be used.


## Build ics files

dev dependencies are required to rebuild ics with the script

    node src/build.js
    


## Others ICS resources

French school holidays

http://www.education.gouv.fr/download.php?file=http%3A%2F%2Fcache.media.education.gouv.fr%2Fics%2FCalendrier_Scolaire_Zones_A_B_C.ics