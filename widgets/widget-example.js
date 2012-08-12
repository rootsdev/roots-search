(function(rs){

  /**
   * The widget needs to be registered the the Roots Search (rs) object.
   * All rs does now it notify when its time to be built. The widget
   * could take care of that itself, but it felt right for rs to do it.
   * Plus, in the future rs will need to know that it exists for other reasons.
   *
   * rs.registerWidget() takes in two parameters:
   *   1) an array of domains (don't include http:// or https://) which the widget runs on
   *   2) the function which will be called then on those domains (it doesnt' have to be called "setup")
   */
  rs.registerWidget(['www.example.org'], setup);
  
  /**
   * In this example, setup gets called whenever we're on www.example.org
   */
  function setup() {
    
    /**
     * First we setup the widget container. Choose carefully where to
     * put the search links. The widget should use the site's style
     * and be in a non-intrusive but useful location.
     */
     
    var widget = $('<div id="#roots-search-widget">').insertAfter( $('#a-good-location') );
    
    /**
     * Next we retrieve the data on the screen. How this is done depends
     * on the site. For FamilySearch it was easiest to make AJAX
     * calls to the apis which the site uses. However, most sites will
     * involve screen scraping.
     */
    var firstName = $('#first-name');
    var lastName = $('#last-name');
    
    /**
     * After retrieving information from the site, it needs to be converted into 
     * the format that the search link builders will expect. They expect an object
     * in following format:
     
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
     
     * None of the attributes are required. Visit the Wiki or examine other
     * widgets for more information on the data format.
     */
     
    var personData = {
      'givenName': firstName,
      'familyName': lastName
    };
     
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
      $('<a>').addClass('search-links').attr({
        'target': '_blank',
        'href': link.url
      }).html(link.text).appendTo(widget);
    });
     
    /**
     * We recommend examining other widgets to get a better idea of how things work.
     */
  }

}(rs));