(function(rs){

  var widgetWrap;
  var alternateNamesRegex = /\[[^\[\]]*\]/g;

  /**
   * Setup the widget when the page loads.
   */
  $(document).ready(function(){
    if( $('#record-header').length == 1) {
      setup();
      
      /**
       * Ancestry's suggested records block information is loaded
       * via AJAX. I can't add anything to the block because it
       * will be overwritten. Appending it afterwards has problems
       * because the records block is set to "visibility: hidden"
       * when empty, which hides it but doesn't remove it from the
       * DOM flow. So our search block is left floating in an awkward
       * spot. The only solution we have is to poll the block. If its
       * set to "visibility: hidden" then we change it to "display: none"
       * and add a top border to our block.
       */
      setTimeout(watchSuggestedRecords, 500);
    }
  });
  
  function watchSuggestedRecords() {
    suggestedBlock = $('#RecordPageHints');
    
    // Check to see if the block has been inserted yet
    if( suggestedBlock.length == 1 ) {
      
      // Is the visibility set to hidden?
      if( suggestedBlock.css('visibility') == 'hidden' ) {
        
        // Hide it (remove from DOM flow)
        suggestedBlock.hide();
        
        // Add top border to our widget block
        widgetWrap.css({
          borderTop: '1px solid #CDC7BE',
          top: '2px'
        });
      }
      
    } else {
      setTimeout(watchSuggestedRecords, 500);
    }
  }
  
  function setup() {
    
    /**
     * First we setup the widget container. Choose carefully where to
     * put the search links. The widget should use the site's style
     * and be in a non-intrusive but useful location.
     */
     
    widgetWrap = $('<div id="RootsSearchWidget">')
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
    
    /**
     * Next we begin retrieving the data on the screen. First we
     * process the result table.
     */
    
    var personData = {};
    var recordData = {};
    $('.p_resultTable tr').each(function(){
      var row = $(this);
      // Take the row label, trim leading and trailing whitespace, 
      // lowercase it, and remove the trailing ":".
      // This will serve as the key in the recordData object
      var label = $.trim( $('th', row).text() ).toLowerCase().slice(0, -1);
      if( label && !recordData[label] ) {
        recordData[label] = row;
      }
    });
    
    // Process the name
    if( recordData.name ) {
      // The regex replace removes alternate names which always appear surrounded by []
      var nameParts = rs.splitName( $.trim( recordData.name.children().eq(1).text().replace(alternateNamesRegex, '') ) );
      personData.givenName = nameParts[0];
      personData.familyName = nameParts[1];
    }
    
    // Process estimated birth year
    var birthInfo = checkMultipleFields( recordData, ['birth year', 'birth date', 'estimated birth year'] );
    if( birthInfo ) {
      personData.birthDate = $.trim( birthInfo.children().eq(1).text() ).replace('abt ','');
    }
    
    // Process the birthplace
    if( recordData.birthplace ) {
      personData.birthPlace = $.trim( recordData.birthplace.children().eq(1).text() );
    }
    
    // Father's name
    if( recordData["father's name"] ) {
      var fatherNameParts = rs.splitName( $.trim( recordData["father's name"].children().eq(1).text().replace(alternateNamesRegex, '') ) );
      personData.fatherGivenName = fatherNameParts[0];
      personData.fatherFamilyName = fatherNameParts[1];
    }
    
    // Mother's name
    if( recordData["mother's name"] ) {
      var motherNameParts = rs.splitName( $.trim( recordData["mother's name"].children().eq(1).text().replace(alternateNamesRegex, '') ) );
      personData.motherGivenName = motherNameParts[0];
      personData.motherFamilyName = motherNameParts[1];
    }
    
    // Spouse's name
    if( recordData["spouse's name"] ) {
      var spouseNameParts = rs.splitName( $.trim( recordData["spouse's name"].children().eq(1).text().replace(alternateNamesRegex, '') ) );
      personData.spouseGivenName = spouseNameParts[0];
      personData.spouseFamilyName = spouseNameParts[1];
    }
    
    /**
     * Build the links
     */
    
    var linkData = rs.executeLinkBuilders(personData);
     
    $.each(linkData, function(i, link) {
      $('<a>').addClass('rs-search-links').attr({
        'target': '_blank',
        'href': link.url
      }).html(link.text).appendTo( $('<div>').css('margin', '8px 0px').appendTo(linksWrap) );
    });
  }
  
  function checkMultipleFields( recordData, fields ) {
    for(var j in fields) {
      if( recordData[fields[j]] ) {
        return recordData[fields[j]];
      }
    }
    return undefined;
  }

}(rs));