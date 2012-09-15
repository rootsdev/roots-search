var personInfoObjects = {};

chrome.extension.onRequest.addListener(function(request, sender) {

  if( request.type == "person_info" ) {
    chrome.pageAction.show(sender.tab.id);
    personInfoObjects[sender.tab.id] = request.data;
  }
  
});

// rs will be an object in the global namespace.
var rs = {
  
  // List of link builders that have been registered
  linkBuilders: {},
  
  // Function for register link builders
  registerLinkBuilder: function(name, handler) {
    this.linkBuilders[name] = {'handler': handler};
  },
  
  // Returns an array of search link objects
  // gathered by executing the builders
  executeLinkBuilders: function(personData) {
    var linkData = [];
    
    // Loop through the builders and call the handlers if they exist
    $.each(this.linkBuilders, function(builderName, builder) {
      if( builder.handler ) {
        // Execute the handlers
        var builderLinkData = builder.handler(personData);
        
        // Be forgiving and allow the handlers to return either a solo object or an array of objects
        if( $.isArray(builderLinkData) ) {
          $.merge(linkData, builderLinkData);
        } else {
          linkData.push(builderLinkData);
        }
      }
    });
    
    return linkData;
  }
  
};