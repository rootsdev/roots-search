(function(rs, utils){

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
  rs.registerLinkBuilder('geni', createUrl);

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
    
    /**
     * An object must be returned in the format shown below.
     * It is valid to return a list of objects if for some reason
     * you want multiple links for your site. However, returning
     * links from different sites is discouraged (mostly because
     * I said so, but also because it makes it more difficult to
     * turn off just one of the sites later).
     *
     * The object below will be turned into a link similar to:
     * <a href="http://myexamplesearchdomain.com/searchstuff">My Example</a>
     **/
    return {
      'text': 'Geni',
      'url': url + name
    };
  }

}(rs, utils));