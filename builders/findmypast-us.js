(function(rs){

  rs.registerLinkBuilder({
    'text': 'Findmypast - US',
    'func': createUrl
  });

  /**
   * The function which you register as your builder
   * needs to accept one parameter: an object
   * representing a persons information. View the wiki
   * for details on the data format.
   **/
  function createUrl(pd) {    
    
    var url = 'http://www.findmypast.com/search?region=United%20States';  
    
    if( pd.givenName ) {
      url = addQueryParam( url, 'firstname', pd.givenName );
      url = addQueryParam( url, 'firstname_variants', 'true' );
    }
    if( pd.familyName ) {
      url = addQueryParam( url, 'lastname', pd.familyName );
      url = addQueryParam( url, 'lastname_variants', 'true' );
    }
    
    // findmypast.com takes in an event range
    // We should start 10 years before birth and 
    // go until 10 years after death or 50 years
    // after birth
    
    if( pd.birthDate ) {
      var startYear = (new Date(pd.birthDate)).getFullYear() - 10;
      var endYear = startYear + 60;
      if( pd.deathDate ) {
        endYear = (new Date(pd.deathDate)).getFullYear() + 10;
      }
      url = addQueryParam( url, 'eventyear', startYear );
      url = addQueryParam( url, 'eventyear_offset', endYear );
    }
    
    return url;
  }
  
  function addQueryParam(query, name, value) {
    return query += '&' + name + '=' + encodeURIComponent( value );
  }

}(rs));