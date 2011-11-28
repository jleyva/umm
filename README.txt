umm: Unofficial Moodle Mobile app
=================================

This is an unofficial clone of the Moodle Mobile app for iPhone that works on Android and Blackberry devices.
It should work also on iPhone and iPad.

This application is intended and has been designed to be easily customizable by Institutions (University, corp..). This application uses common web technologies (HTML5 + CSS3 + JavaScript) and the high level multiplatform mobile Javascript framework Phonegap.
Phonegap enables you to build your app once with web-standards and deploy to multiple platforms.

Please note that this app is not a replacement or improvement of the official app for iPhone (and Android when available). It has beend designed to be easily customizable and extendable using web technologies by anyone.

Technologies used:

HTML5 + CSS3 + JavaScript
Phonegap for packaging and access Mobile features
jquery
jquerymobile

Credits:
Juan Leyva <http://twitter.com/#!/jleyvadelgado>
http://moodle.org/user/profile.php?id=49568


Current apps download links:
----------------------------

These are the last builds.

For installing you must enable in your Mobile the installation of apps from unknown sources

Android:
https://build.phonegap.com/apps/49110/download/android

Blackberry:
https://build.phonegap.com/apps/49110/error/blackberry


Testing the app in a computer:
-----------------------------

OPTION 1:
Requeriments: Google Chrome browser + Ripple mobile enviroment emulator plugin (http://ripple.tinyhippos.com/)

You must run Google Chrome in Unsafe mode adding this params: --allow-file-access-from-files --disable-web-security

IMPORTANT: I strong recommend you to create a new link or application launch called "Google Unsafe" and use it only for testing the app

"Path to chrome\chrome.exe" --allow-file-access-from-files --disable-web-security

Open the index.html file in the Google Chrome unsafe and click on the Ripple icon to activate the emulator

Once opened in the Ripple settings block change Cross Domain Proxy to Disabled

Please note that some functionallities (camera, audio recording, contact) will not work in the emulator

OPTION 2:
Install the Android, BlackBerry or iPhone SDK and follow instructions in http://phonegap.com/start/

Configuring Moodle for using the application:
---------------------------------------------

Administration -> Plugins -> Web Services -> External Services -> Enable mobile web service

Administration -> Plugins -> Web Services -> Protocols -> Enable REST

Administration -> Users -> Permission -> Define roles -> Edit the Authenticated user role -> Allow webservice/rest:use 

Administration -> Security  -> Site policies -> Change the server upload limit. It can't be Server limit. There is a bug in Moodle Web Services see (http://tracker.moodle.org/browse/MDL-30496)


Building this app for iPhone:
-----------------------------

You need to create a certificate in a Mac computer to sign the app
Please, read the section "Customizing your own app" bellow
Note also that for distributing your app you must add it in the app store.


Customizing your own app:
-------------------------

Application name and description
Edit the config.xml file

Application icon
Replace the icon*.png files with your custom icons (PNG 32bits)
You can add also more icons if you mobile supports it editing the config.xml file

Style sheet
Create your own CSS
Include this CSS in all the files you want to customize

Packaging the app for Android, Blackberry and iPhone
Crete a free account in https://build.phonegap.com/
Upload a zip with all the contents of your custom app
That's all, Phonegap Build do all the steps required

IMPORTANT: The files names cannot containts these chars: - or _


Extending the app:
------------------

The app works as a mini HTML site, it is very easy to add custom pages. Just add new pages and create links between the new and old pages.
It's very easy also add new pages that consumes MoodleWebServices (there is a high level API for making Moodle WS Calls)
If you want integrate your app with your mobile device (accelerometer, camera, compass, contacts, gps) you can use de Phonegap API
http://www.phonegap.com/


VERSIONS:
---------

Current: 0.8 alpha 

Known bugs and issues:
----------------------
Upload of images and records may fail if your max upload file size server setting is set to No limit. (This is a Moodle issue) See http://tracker.moodle.org/browse/MDL-30496 
Do not work offline
Contacts are saved in your Google account contacts (Android) This is a Phonegap bug
Profile users image are not displayed (This is a Moodle issue) See http://tracker.moodle.org/browse/MDL-30495





