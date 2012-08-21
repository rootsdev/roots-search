(function(rs){

  /**
   * Setup the widget when the page loads.
   */
  $(document).ready(function(){
    setup();
  });
  
  function setup() {
    
    /**
     * First we setup the widget container. We will place it on
     * the right side above the family relationship boxes.
     */
     
    var widget = $('<div id="#roots-search-widget">')
      .addClass('wr-infobox wr-infobox-familybadge wr-infobox-spousechildren')
      .prependTo( $('.wr-infobox-familybadges') )
      .append( $('<div>').addClass('wr-infobox-heading').html('Records Search') );     
    var linkWrap = $('<div>').addClass('rs-lnk-wrap').appendTo(widget);
    
    /**
     * Next we begin retrieving the data on the screen. First we
     * process the Facts and Events table.
     */
    
    var personData = {};
    var recordData = {};
    $('.wr-infotable-factsevents tr').each(function(){
      var row = $(this);
      var label = $.trim( $('span.wr-infotable-type', row).text() ).toLowerCase();
      if( !recordData[label] ) {
        recordData[label] = row;
      }
    });
    
    // Process the name
    if( recordData.name ) {
      var nameParts = rs.splitName( $.trim( recordData.name.children().eq(1).children('span').text() ) );
      personData.givenName = nameParts[0];
      personData.familyName = nameParts[1];
    }
    
    // Process birth info
    if( recordData.birth ) {
      var birthDate = $.trim( $('span.wr-infotable-date', recordData.birth).text() );
      if( birthDate ) {
        personData.birthDate = birthDate;
      }
      var birthPlace = $.trim( $('span.wr-infotable-place', recordData.birth).text() );
      if( birthPlace ) {
        personData.birthPlace = birthPlace;
      }
    }
    
    // Process death info
    if( recordData.death ) {
      var deathDate = $.trim( $('span.wr-infotable-date', recordData.death).text() );
      if( deathDate ) {
        personData.deathDate = deathDate;
      }
      var deathPlace = $.trim( $('span.wr-infotable-place', recordData.death).text() );
      if( deathPlace ) {
        personData.deathPlace = deathPlace;
      }
    }
    
    // Process spouse's name
    if( recordData.marriage ) {
      var spouseNameParts = rs.splitName( $.trim( $('.wr-infotable-placedesc .wr-infotable-desc', recordData.marriage).text().substring(3) ) );
      personData.spouseGivenName = spouseNameParts[0];
      personData.spouseFamilyName = spouseNameParts[1];
    }
    
    // Get parents names
    var parentsBox = $('.wr-infobox-parentssiblings:first');
    if( parentsBox.length == 1 ){
      $('ul .wr-infobox-fullname', parentsBox).each(function(i,e){
        var parentNameParts = rs.splitName( $.trim( $(this).text().substring(4) ) );
        if( i == 0 ) {
          personData.fatherGivenName = parentNameParts[0];
          personData.fatherFamilyName = parentNameParts[1];
        } else {
          personData.motherGivenName = parentNameParts[0];
          personData.motherFamilyName = parentNameParts[1];
        }
      });
    }

    /**
     * Build the links
     */
     
    var linkData = rs.executeLinkBuilders(personData);
    $.each(linkData, function(i, link) {
      $('<a>').addClass('rs-search-link').attr({
        'target': '_blank',
        'href': link.url
      }).html(link.text).appendTo(linkWrap);
    });
  }

}(rs));