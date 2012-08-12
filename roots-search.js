// On each page load, find widgets that should be built 
$(document).ready(function(){  
  rs.processWidgets(window.location.host)
});

// rs will be an object in the global namespace
// that will build the search widgets.
var rs = {
  
  // List of widgets that have been registered
  widgets: {},
  
  // Registers a widget with a handler to be called
  // then the current page matches the given domains
  registerWidget: function(domains, handler) {
    var self = this;
    
    // Allow for just a single domain to be given
    if( !$.isArray(domains) ) {
      domains = [ domains ];
    }
    
    // Register the handler with each domain
    $.each(domains, function(i, d) {
      if( !self.widgets[d] ) {
        self.widgets[d] = [];
      }
      self.widgets[d].push(handler);
    });
  },
  
  // Call the handlers of widgets registered with the given domain
  processWidgets: function(domain) {
    $.each( this.widgets[domain], function(i, handler) {
      handler();
    });
  },
  
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
  },
  
  // Returns the hash values as a map {key:value}
  getHashParts: function() {
    var hashParts = {};
    $.each(window.location.hash.substring(1).split('&'), function(i, part) {
      var partPieces = part.split('=');
      hashParts[partPieces[0]] = partPieces[1];
    });
    return hashParts;
  },
  
  // Parses a date string and returns the year
  getYear: function(date) {
    return (new Date(date)).getFullYear();
  },
  
  // Returns an array of strings with [0] being the given names and [1] being the family name
  // This function assumes that there is only one family name
  splitName: function(name) {
    // Get given names and last name
    return name.split(/\s+(?=\S*$)/);
  }
};

// The following lines extend the date object to
// all for retrieving month names (long and short)
Date.prototype.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];
Date.prototype.getMonthName = function() {
    return this.monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
    return this.getMonthName().substr(0, 3);
};