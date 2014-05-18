Roots Search Chrome Extension
=============================

The Roots Search Chrome Extension connects popular genealogy websites by providing search links when viewing records or people. For example, when viewing a person in your tree on FamilySearch, this extension will add links to the page for searching for that same person on Ancestry, WeRelate, FamilySearch itself, and more. This removes the need to copy and paste lots of information when searching on multiple websites.

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

## Widgets

Widgets pull information off of a web page and populate the search form.

1. Create a copy of `widgets/widget-example.js` and rename it to something that is appropriate for your widget. Names usually include the name of the site which it operates on as well as the context. For example: `werelate-person-search.js`.
1. Follow instructions in `widget-example.js` to gather data (through scraping or an API) and create a person data object which matches the [gen-search schema](https://github.com/genealogysystems/gen-search#schema) which is sent to the background page
1. Add your widget's js file and optional css file to `manifest.json`
  1. Add an object to the `content_scripts` array for your widget (you might start by copying the object for another widget)
  1. Add your js file to the js array
  1. Configure the matches string so that the js file is only injected on sites where it operate
  1. Add the same match strings from the previous step to the `permissions` array near the top of the manifest as well as the `matches` array for the first `content_scripts` object that injects the roots search controller
  1. Read more about configuring [content scripts](http://developer.chrome.com/extensions/content_scripts.html)
1. Reload the widget from the `chrome://extensions` page and test it
1. Submit a pull request to share your new widget

### Search links

1. Submit a pull request to [gen-search](https://github.com/genealogysystems/gen-search).
2. When the pull request has been accepted, add the site to the site list in [background.js](https://github.com/rootsdev/roots-search/blob/master/background/background.js) or create an issue to request that we update gensearch.

__Additional search links will not be added until we implement an options page__
