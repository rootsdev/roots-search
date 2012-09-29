(function(utils, undefined){

  /**
   * Setup the widget when the page loads.
   */
  $(document).ready(function(){
    setup();
  });
  
  function setup() {
    
    /**
     * Get the name
     */
    var nameParts = utils.splitName( $('.pInfo h2').html() );
    
    var personData = {
      'givenName': nameParts[0],
      'familyName': nameParts[1],
      'birthDate': $('.pInfo .birth .date').text(),
      'birthPlace': $('.pInfo .birth .place .placeLink').text(),
    };
    
    // Parse death info if the person isn't living
    var deathDetails = $('.pInfo .death:visible');
    if( $('a.livingTag', deathDetails).length == 0 ) {
      personData['deathDate'] = $('.date', deathDetails).text();
      personData['deathPlace'] = $('.place .placeLink', deathDetails).text();
    }
    
    //
    // Process relationships
    //
    
    var parentsBlock = $('.famMem .section').eq(0);
    
    // Father's name
    if( $('.male.add').length == 0 ) {
      var fatherNameParts = utils.splitName( $('.male .details .name', parentsBlock).text() );
      personData['fatherGivenName'] = fatherNameParts[0];
      personData['fatherFamilyName'] = fatherNameParts[1];
    }
    
    // Mother's name
    if( $('.female.add').length == 0 ) {
      var motherNameParts = utils.splitName( $('.female .details .name', parentsBlock).text() );
      personData['motherGivenName'] = motherNameParts[0];
      personData['motherFamilyName'] = motherNameParts[1];
    }
    
    // Spouse's name
    var spouseBlock = $('.famMem .section').eq(1);
    var spouseNameParts = utils.splitName( $('.main li .details .name', spouseBlock).text() );
    personData['spouseGivenName'] = spouseNameParts[0];
    personData['spouseFamilyName'] = spouseNameParts[1];
     
    /**
     * Now we send the data to the background script that
     * will activate the popup icon in the address bar
     */
     
    chrome.extension.sendRequest({
      'type': 'person_info',
      'data': personData
    });
     
    /**
     * We recommend examining other widgets to get a better idea of how things work.
     */
  }

}(utils));