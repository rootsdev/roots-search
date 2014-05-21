// Set the debug flag if the extension isn't installed via the webstore
var debug = chrome.app.getDetails().update_url ? false : true;

var personDataObjects = {};

_gaq.push(['_trackEvent', 'Start', 'Version', chrome.app.getDetails().version]);

chrome.extension.onRequest.addListener(function(request, sender) {

  if( request.type == "person_info" ) {
    
    // Verify format of dates; they cause errors if they're not valid
    if( typeof request.data.birthDate !== 'undefined' && !isValidDate(request.data.birthDate) ) {
      if( debug ) {
        console.error('Bad birth date: ' + request.data.birthDate);
      }
      request.data.birthDate = undefined;
      _gaq.push(['_trackEvent', 'Error', 'Bad Birth Date', sender.tab.url]);
    }
    if( typeof request.data.deathDate !== 'undefined' && !isValidDate(request.data.deathDate) ) {
      if( debug ) {
        console.error('Bad death date: ' + request.data.deathDate);
      }
      request.data.deathDate = undefined;
      _gaq.push(['_trackEvent', 'Error', 'Bad Death Date', sender.tab.url]);
    }
    
    // Show the RootsSearch icon
    chrome.pageAction.show(sender.tab.id);
    
    // Store the data so that the popup can retrieve it
    personDataObjects[sender.tab.id] = {
      'original': request.data,
      'url': sender.tab.url
    };
    
    _gaq.push(['_trackEvent', 'Data', 'Process', sender.tab.url]);
  }
  
  else if( request.type == "hide" ) {
    chrome.pageAction.hide(sender.tab.id);
  }
  
  else if( request.type == "js_error" ) {
    request.data.message += "\n\nRootsSearch version" + chrome.app.getDetails().version;
    if(debug) {
      console.log(request.data);
    } else {
      // Send Justin York an email about all JS errors that were caught in production
      $.post('https://rs-errors.herokuapp.com', request.data);
    }
    _gaq.push(['_trackEvent', 'Error', 'JS', sender.tab.url]);
  }
  
  else if( request.type == "visit" ) {
    _gaq.push(['_trackPageview', sender.tab.url]);
    _gaq.push(['_trackEvent', 'Visit', 'Record', sender.tab.url]);
  }
  
});

function isValidDate(d) {
  d = new Date(d);
  if ( Object.prototype.toString.call(d) !== "[object Date]" )
    return false;
  return !isNaN(d.getTime());
}

// List of gen-search sites we're using. 
// Key is the gensearch site name; value is the display name
var sites = {
  'ancestry': 'Ancestry',
  'archives': 'Archives',
  'billiongraves': 'BillionGraves',
  'familysearch': 'FamilySearch',
  'findagrave': 'Find-A-Grave',
  'geni': 'Geni',
  'werelate': 'WeRelate'
};