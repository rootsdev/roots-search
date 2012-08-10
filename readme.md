FamilySearch Family Tree Enhancements
=====================================

FamilySearch Family Tree Enhancements is a Chrome extension that enhances FamilySearch's new Family Tree by adding search links on person pages to popular genealogy sites (including FamilySearch itself) This makes it easier to search for more records about your ancestor by removing the need to copy and paste all of the personal details.

Install
-------

*This extension is not currently available in the Chrome Web Store.*

1. Download the zip file from github and unzip it.
1. Open the Extensions window in Chrome (chrome://chrome/extensions/).
1. Check the box labeled "Developer mode".
1. Click the button labeled "Load unpacked extension...".
1. Select the folder where you unzipped the files.

Adding More Site Links
----------------------

It is easy to add search links to other sites.

1. Create a copy of `builders/sample.js` and rename it with the name of the site for which you are making a builder.
1. Modify your new JavaScript file so that it correctly builds urls. There are more instructions about this in the sample.js file.
1. Add your new JavaScript file to the `content_scripts['js']` list and reload the extension.
1. Share your new builder.