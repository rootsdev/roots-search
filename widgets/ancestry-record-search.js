(function(rs){

  /**
   * Setup the widget when the page loads.
   */
  $(document).ready(function(){
    setup();
  });
  
  function setup() {
    
    /**
     * First we setup the widget container. Choose carefully where to
     * put the search links. The widget should use the site's style
     * and be in a non-intrusive but useful location.
     */
     
    var widgetWrap = $('<div id="RootsSearchWidget">')
      .insertAfter( $('#RecordPageHints') )
      .css({ 
        position: 'relative',
        top: '-7px',
        backgroundColor: '#FBFAFA',
        border: '1px solid #CDC7BE',
        borderLeft: 'none',
        borderTop: 'none',
        left: '-6px',
        padding: '8px 8px 8px 0',
        zIndex: '98'
      });
      
    var widget = $('<div>')
      .addClass('recordHints')
      .append('<div class="recordHintsHd"><h3>Roots Search</h3></div>')
      .appendTo(widgetWrap);
    
    var linksWrap = $('<div class="recordHintsBd">').appendTo(widget);
    
    linksWrap.append( $('<a class="rs-search-link" href="#">Example</a>') );
    
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
    
    return;
    
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