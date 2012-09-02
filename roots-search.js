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
  },
  
  // Returns the hash values as a map {key:value}
  getHashParts: function() {
    var hashParts = {};
    if( window.location.hash ) {
      $.each(window.location.hash.substring(1).split('&'), function(i, part) {
        var partPieces = part.split('=');
        hashParts[partPieces[0]] = partPieces[1];
      });
    }
    return hashParts;
  },
  
  // Parses a date string and returns the year
  getYear: function(date) {
    return (new Date(date)).getFullYear();
  },
  
  // Returns an array of strings with [0] being the given names and [1] being the family name
  // This function assumes that there is only one family name
  splitName: function(name) {
    if( name ) {    
      return name.split(/\s+(?=\S*$)/);
    } else {
      return ['',''];
    }
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