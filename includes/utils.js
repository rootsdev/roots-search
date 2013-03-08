var utils = {
  
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
  
  // Returns an object containing the query parameters and values
  getQueryParams: function(){
    var paramArray = window.location.search.substr(1).split("&");
    var params = {};

    for ( var i = 0; i < paramArray.length; i++) {
      var tempArray = paramArray[i].split("=");
      params[tempArray[0]] = tempArray[1];
    }
    
    return params;
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
  },
  
  reportError: function(exception, url) {
    chrome.extension.sendRequest({
      'type': 'js_error',
      'data': {
        'title': exception.name,
        'message': exception.message + "\n\n" + exception.stack,
        'url': url
      }
    });
  }
  
};