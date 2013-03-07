(function(rs){

  rs.registerLinkBuilder({
    text: 'Findmypast - UK', 
    func: createUrl
  });

  /**
   * The function which you register as your builder
   * needs to accept one parameter: an object
   * representing a persons information. View the wiki
   * for details on the data format.
   **/
  function createUrl(pd) {    
    
    var url = 'http://www.findmypast.co.uk/search/all-records/results?';
    var query = '';
    
    if( pd.givenName ) {
      query = addQueryParam( query, 'forename', pd.givenName );
      query = addQueryParam( query, '_includeForenameVariants', 'on' );
    }
    if( pd.familyName ) {
      query = addQueryParam( query, 'surname', pd.familyName );
      query = addQueryParam( query, '_includeSurnameVariants', 'on' );
    }
    
    if( pd.birthDate ) {
      query = addQueryParam( query, 'fromYear', (new Date(pd.birthDate)).getFullYear() );
    }
    
    if( pd.deathDate ) {
      query = addQueryParam( query, 'toYear', (new Date(pd.deathDate)).getFullYear() );
    }
    
    // remove leading "&"
    return url + query.slice(1);
  }
  
  function addQueryParam(query, name, value) {
    return query += '&' + name + '=' + encodeURIComponent( value );
  }

}(rs));