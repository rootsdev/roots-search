var personDataObjects = {};

chrome.extension.onRequest.addListener(function(request, sender) {

  if( request.type == "person_info" ) {
    
    // Verify format of dates; they cause errors if they're not valid
    if( !isValidDate(request.data.birthDate) ) {
      request.data.birthDate = undefined;
    }
    if( !isValidDate(request.data.deathDate) ) {
      request.data.deathDate = undefined;
    }
    
    // Show the RootsSearch icon
    chrome.pageAction.show(sender.tab.id);
    
    // Store the data so that the popup can retrieve it
    personDataObjects[sender.tab.id] = {
      'original': request.data,
      'url': sender.tab.url
    };
  }
  
  else if( request.type == "hide" ) {
    chrome.pageAction.hide(sender.tab.id);
  }
  
  else if( request.type == "js_error" ) {
    $.post('https://rs-errors.herokuapp.com', request.data);
  }
  
  else if( request.type == "visit" ) {
    _gaq.push(['_trackPageview', request.data]);
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