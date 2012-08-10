(function(fs){

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
  fs.registerSearchBuilder('sample', createUrl);

  /**
   * The function which you register as your builder
   * needs to accept two parameters: 1) an object
   * representing a persons summary/basic info, and
   * 2) an object representing that the persons
   * relationships. The structure of the two objects
   * is not trivial so I won't attempt to document it.
   * Looks at the other builders for tips on how to
   * process them.
   **/
  function createUrl(summary, relationships) {    
    
    /**
     * Here is where you process the objects and build your search url.
     * the fs object passed in at the top of this file contains some
     * utility functions that aid in processing the data.
     *
     * fs.getYear() takes in a date string returned by FamilySearch
     * (ex: 4 January 1849) and returns the year as an interger.
     *
     * fs.processName() takes in a name string and returns an array
     * of strings with [0] being the given names and [1] being the 
     * family name. It assumes that there is only one family name
     */
    
    /**
     * An object must be return in the format shown below.
     * It is valid to return a list of objects if for some reason
     * you want multiple links for your site. However, returning
     * links from different sites is discouraged (mostly because
     * I said so, but also because it makes it more difficult to
     * turn off just one of the sites later).
     *
     * The object below will be turned into a link similar to:
     * <a href="http://mysamplesearchurl.com/searchstuff">My Sample</a>
     **/
    return {
      'text': 'My Sample',
      'url': 'http://mysamplesearchurl.com/searchstuff'
    };
  }

}(fsTreeSearch));