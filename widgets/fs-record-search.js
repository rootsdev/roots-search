(function(rs){

  rs.registerWidget(['familysearch.org'], verifySetup);
  
  function verifySetup() {
    if( window.location.pathname.indexOf('/pal:/') == 0 ) {
      setup();
    }
  }
  
  function setup() {
    
    /**
     * First we setup the widget container. Choose carefully where to
     * put the search links. The widget should use the site's style
     * and be in a non-intrusive but useful location.
     */
     
    var searchTrigger = $('<li class="rs-search-tool"><a href="#">SEARCH</a></li>').appendTo( $('.global-toolbar .toolset') );
    var flyout = $('<nav class="flyout share-flyout"><div class="flyout-direction"><div></div></div></nav>').appendTo(searchTrigger);
    var linksList = $('<ul>').prependTo(flyout);
    
    var nameParts = rs.splitName( $.trim( $('.result-data tr:first td[itemprop="name"]').text() ) );
    
    var personData = {
      'givenName': nameParts[0],
      'familyName': nameParts[1],
      'birthDate': $.trim( $('#birth_date').text() ),
      'birthPlace': $.trim( $('#birth_location td[itemprop="name"]').text() ),
      'deathDate': $.trim( $('#death_date').text() ),
      'deathPlace': $.trim( $('#death_location td[itemprop="name"]').text() )
    };
        
    /**
        {
          'givenName': givenName,
          'familyName': familyName,
          'birthPlace': birthPlace,
          'birthDate': birthDate,
          'deathPlace': deathPlace,
          'deathDate': deathDate,
          'fatherGivenName': fatherGivenName,
          'fatherFamilyName': fatherFamilyName,
          'motherGivenName': motherGivenName,
          'motherFamilyName': motherFamilyName,
          'spouseGivenName': spouseGivenName,
          'spouseFamilyName': spouseFamilyName
        }
     */
     
    /**
     * Now that we have data in the correct format, we pass it to the
     * rs.executeLinkBuilders() function. This will pass the data on
     * to all of the search link builders and return an array of link
     * objects in the following format:
     *
     *  { 'text': 'My Example Link', 'url': 'http://myexamplesearchdomain.com/searchstuff' }
     *
     * Asking the link builders to only return the link text and url
     * allows for the widgets to build the links however they want:
     * as <a> or <button> tags, with classes and styles that match
     * the page, etc.
     *
     * Loop over the link array and add your links to the widget.
     */
    
    var linkData = rs.executeLinkBuilders(personData);
     
    $.each(linkData, function(i, link) {
      linksList.append( '<li><a href="'+link.url+'" target="_blank">'+link.text.toUpperCase()+'</a></li>' );
    });

  }

}(rs));