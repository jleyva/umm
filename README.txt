umm: Unofficial Moodle Mobile app
=================================

This is an unofficial clone of the Moodle Mobile app for iPhone that works on Android and Blackberry devices.
It should work also on iPhone and iPad.

This application is intended and have been designed to be easily customizable by Institutions (University, corp..)
This application is not a replacement or improvement of the official app for iPhone (and Androi when available)

Credits:



Current apps download links:
----------------------------

These are the last builds.

For installing you must enable in your Mobile Browse installation of apps from unknown sources

Android:
https://build.phonegap.com/apps/49110/download/android

Blackberry:
https://build.phonegap.com/apps/49110/error/blackberry


Testing the app in a computer:
-----------------------------

Requeriments: Google Chrome browser + Ripple mobile enviroment emulator plugin (http://ripple.tinyhippos.com/)

You must run Google Chrome in Unsafe mode adding this params: --allow-file-access-from-files --disable-web-security

IMPORTANT: I strong recommend to create a new link or application launch called "Google Unsafe" and uses only for testing the app

"Path to chrome\chrome.exe" --allow-file-access-from-files --disable-web-security

Open the index.html file in the Google Chrome unsafe and click on the Ripple icon to activate the emulator


Configuring Moodle for using the application:
---------------------------------------------

Administration -> Plugins -> Web Services -> External Services -> Enable mobile web service

Administration -> Plugins -> Web Services -> Protocols -> Enable REST

Administration -> Users -> Permission -> Define roles -> Edit the Authenticated user role -> Allow webservice/rest:use 


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
Crete an account in https://build.phonegap.com/
Upload a zip with all the contents of your custom app
That's all

IMPORTANT: The file names cannot containt these chars: - or _


Extending the app:
------------------

The app works as a mini HTML site, it is very easy add custom pages
It's very easy also add new pages that consumes MoodleWebServices (there is a high level API for making Moodle WS Calls)
If you want integrate your app with your mobile device (accelerometer, camera, compass, contacts, gps) you can use de Phonegap API
http://www.phonegap.com/





