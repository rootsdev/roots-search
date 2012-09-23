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