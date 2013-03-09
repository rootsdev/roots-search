var personDataObjects = {};

_gaq.push(['_trackEvent', 'Start', 'Version', chrome.app.getDetails().version]);

chrome.extension.onRequest.addListener(function(request, sender) {

  if( request.type == "person_info" ) {
    
    // Verify format of dates; they cause errors if they're not valid
    if( typeof request.data.birthDate !== 'undefined' && !isValidDate(request.data.birthDate) ) {
      request.data.birthDate = undefined;
      _gaq.push(['_trackEvent', 'Error', 'Bad Birth Date', sender.tab.url]);
    }
    if( typeof request.data.deathDate !== 'undefined' && !isValidDate(request.data.deathDate) ) {
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
    $.post('https://rs-errors.herokuapp.com', request.data);
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

// rs will be an object in the global namespace.
var rs = {
  
  // List of link builders that have been registered
  linkBuilders: {},
  
  // Function for register link builders
  registerLinkBuilder: function(config) {
    this.linkBuilders[config.text] = config.func;
  }
  
};