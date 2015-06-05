RootsSearch Chrome Extension
=============================

The RootsSearch Chrome Extension connects popular genealogy websites by providing search links when viewing records or people. For example, when viewing a person in your tree on FamilySearch, this extension will add links to the page for searching for that same person on Ancestry, WeRelate, FamilySearch itself, and more. This removes the need to copy and paste lots of information when searching on multiple websites.

Install
-------

Install the latest release in the [Chrome Web Store](https://chrome.google.com/webstore/detail/rootssearch/aolcffalbhpnojekmimmelebjchjmmgn).

To install the latest development from source:

1. Download the zip file from github and unzip it.
1. Open the Extensions window in Chrome (chrome://chrome/extensions/).
1. Check the box labeled "Developer mode".
1. Click the button labeled "Load unpacked extension...".
1. Select the folder where you unzipped the files.

Adding Support For More Websites
----------------------------------

There are two ways a site can be supported: a widget or a search link.

### Scrapers

Scrapers pull information off of a web page and populate the search form.

1. Open an issue or submit a pull request to [genscrape](https://github.com/rootsdev/genscrape).
2. When genscrape has been updated, open an issue here or submit a pull request to update RootsSearch with the new version of genscrape.

### Search links

1. Create an issue or submit a pull request to [gensearch](https://github.com/genealogysystems/gensearch).
2. When the pull request has been accepted, add the site to the site list in [background.js](https://github.com/rootsdev/roots-search/blob/master/background/site.js) or create an issue to request that we update roots-search with the new version of gensearch.
