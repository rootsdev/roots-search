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
  rs.registerLinkBuilder('billiongraves', createUrl);

  /**
   * The function which you register as your builder
   * needs to accept one parameter: an object
   * representing a persons information. View the wiki
   * for details on the data format.
   **/
  function createUrl(pd) {    
    
    var url = 'http://billiongraves.com/pages/search/index.php#year_range=5&lim=0&num=20&action=search&exact=false&country=0&state=0&county=0';
    var query = '';
    
    'given_names=alma&family_names=clark&birth_year=1910&death_year=1999'
    
    if( pd.givenName ) {
      query = addQueryParam( query, 'given_names', pd.givenName );
    }
    if( pd.familyName ) {
      query = addQueryParam( query, 'family_names', pd.familyName );
    }
    
    if( pd.birthDate ) {
      query = addQueryParam( query, 'birth_year', (new Date(pd.birthDate)).getFullYear() );
    }
    
    if( pd.deathDate ) {
      query = addQueryParam( query, 'death_year', (new Date(pd.deathDate)).getFullYear() );
    }
    
    return {
      'text': 'Billion Graves',
      'url': url + query
    };
  }
  
  function addQueryParam(query, name, value) {
    return query += '&' + name + '=' + encodeURIComponent( value );
  }

}(rs));