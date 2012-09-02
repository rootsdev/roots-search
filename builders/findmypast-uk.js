(function(rs){

  /**
   * The first parameter is the name of your builder. It
   * should match the name of your builder file. The
   * name is mostly used to prevent a builder from being
   * registered twice but it may be used for more in the
   * future. This name *is not* what is used for the text
   * of the search links.
   *
   * The second parameter is the handler which processes
   * the person data and returns links objects. It does
   * not need to be called createUrl, although there
   * shouldn't be a reason to change it. Read more
   * about this below.
   **/
  rs.registerLinkBuilder('findmypast-uk', createUrl);

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
    
    return {
      'text': 'Findmypast - UK',
      'url': url + query.slice(1) // remove leading &
    };
  }
  
  function addQueryParam(query, name, value) {
    return query += '&' + name + '=' + encodeURIComponent( value );
  }

}(rs));