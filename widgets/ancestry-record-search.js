(function(rs){

  /**
   * Setup the widget when the page loads.
   */
  $(document).ready(function(){
    if( $('#record-header').length == 1) {
      console.log("we're going in");
      setup();
    }
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
      var nameParts = rs.splitName( $.trim( recordData.name.children().eq(1).text() ) );
      personData.givenName = nameParts[0];
      personData.familyName = nameParts[1];
    }
    
    // Process estimated birth year
    if( recordData['estimated birth year'] ) {
      personData.birthDate = $.trim( recordData['estimated birth year'].children().eq(1).text() ).substr(4);
    }
    
    // Process the birthplace
    if( recordData.birthplace ) {
      personData.birthPlace = $.trim( recordData.birthplace.children().eq(1).text() );
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
     
    /**
     * We recommend examining other widgets to get a better idea of how things work.
     */
  }

}(rs));