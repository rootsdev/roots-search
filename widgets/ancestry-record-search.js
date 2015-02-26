(function(utils, undefined){

  var alternateNamesRegex = /\[[^\[\]]*\]/g;

  /**
   * Setup the widget when the page loads.
   */
  $(document).ready(function(){
    if( $('#recordData').length == 1) {
      try {
        setup();
      } catch(e) {
        utils.reportError(e, window.location.href);
      }
    }
  });
  
  function setup() {
    
    /**
     * Next we begin retrieving the data on the screen. First we
     * process the result table.
     */
    
    var personData = {};
    var recordData = {};
    $('#recordData .table tr').each(function(){
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
      var nameParts = utils.splitName( $.trim( recordData.name.children().eq(1).text().replace(alternateNamesRegex, '') ) );
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
      var fatherNameParts = utils.splitName( $.trim( recordData["father's name"].children().eq(1).text().replace(alternateNamesRegex, '') ) );
      personData.fatherGivenName = fatherNameParts[0];
      personData.fatherFamilyName = fatherNameParts[1];
    }
    
    // Mother's name
    if( recordData["mother's name"] ) {
      var motherNameParts = utils.splitName( $.trim( recordData["mother's name"].children().eq(1).text().replace(alternateNamesRegex, '') ) );
      personData.motherGivenName = motherNameParts[0];
      personData.motherFamilyName = motherNameParts[1];
    }
    
    // Spouse's name
    if( recordData["spouse's name"] ) {
      var spouseNameParts = utils.splitName( $.trim( recordData["spouse's name"].children().eq(1).text().replace(alternateNamesRegex, '') ) );
      personData.spouseGivenName = spouseNameParts[0];
      personData.spouseFamilyName = spouseNameParts[1];
    }
    
    chrome.extension.sendRequest({
      'type': 'person_info',
      'data': personData
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

}(utils));