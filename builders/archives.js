(function(rs, utils){

  rs.registerLinkBuilder({
    text: 'Archives', 
    func: createUrl
  });

  /**
   * The function which you register as your builder
   * needs to accept one parameter: an object
   * representing a persons information. View the wiki
   * for details on the data format.
   **/
  function createUrl(pd) {    
    
    var url = 'http://www.archives.com/GA.aspx';    
    var query = '?_act=registerAS_org&Location=US';
    
    /**
     * None of the attributes for the person data object are required
     * so we check to see if they exist before using them.
     * 
     * It is usually a good idea to put the query building logic
     * into a function (addQueryParam in this example). It makes 
     * the code a lot cleaner.
     */
    if( pd.givenName ) {
      query = addQueryParam( query, 'FirstName', pd.givenName );
    }
    if( pd.familyName ) {
      query = addQueryParam( query, 'LastName', pd.familyName );
    }
    if( pd.birthDate ) {
      query = addQueryParam( query, 'BirthYear', utils.getYear(pd.birthDate) );
      query = addQueryParam( query, 'BirthYearSpan', '5' );
    }
    if( pd.deathDate ) {
      query = addQueryParam( query, 'DeathYear', utils.getYear(pd.deathDate) );
      query = addQueryParam( query, 'DeathYearSpan', '5' );
    }

    return url + query;
  }
  
  function addQueryParam(query, name, value) {
    return query += '&' + name + '=' + encodeURIComponent( value );
  }

}(rs, utils));