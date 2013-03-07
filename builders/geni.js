(function(rs, utils){

  rs.registerLinkBuilder({
    text: 'Geni', 
    func: createUrl
  });

  /**
   * The function which you register as your builder
   * needs to accept one parameter: an object
   * representing a persons information. View the wiki
   * for details on the data format.
   **/
  function createUrl(pd) {    
    
    var url = 'http://www.geni.com/search?search_type=people&names=';
    
    var name = "";
    
    if( pd.givenName ) {
      name += pd.givenName;
    }
    if( pd.familyName ) {
      if( name ) {
        name += " ";
      }
      name += pd.familyName;
    }
    
    // Replace spaces with +
    name = name.replace(/ /g, '+');
    
    return url + name;
  }

}(rs, utils));