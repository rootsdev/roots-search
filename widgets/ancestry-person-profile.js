(function(utils, undefined){

  /**
   * Setup the widget when the page loads.
   */
  $(document).ready(function(){
    try {
      setup();
    } catch(e) {
      utils.reportError(e, window.location.href);
    }
  });
  
  function setup() {
    
    /**
     * Get the name
     */
    var nameParts = utils.splitName( $('.pInfo h1').html() );
    
    var personData = {
      'givenName': nameParts[0],
      'familyName': nameParts[1]
    };
    
    var events = {};
    
    // Gather events
    $('.eventList .eventDefinition').each(function(){
      var event = $(this),
          type = event.find('dt').text().trim().toLowerCase(),
          day = event.find('.eventDay').text().trim(),
          year = event.find('.eventYear').text().trim(),
          place = event.find('.eventPlace').text().trim();
      events[type] = {
        date: day + ' ' + year,
        place: place
      };      
    });
    
    // Birth
    var birth = events.birth || events.christening || null;
    if(birth) {
      personData['birthDate'] = birth.date;
      personData['birthPlace'] = birth.place;
    }
    
    // Death
    var death = events.death || events.burial || null;
    if(death) {
      personData['deathDate'] = death.date;
      personData['deathPlace'] = death.place;
    }
    
    // TODO get the marriage info
    
    //
    // Process relationships
    //
    
    var parentsBlock = $('.famMem .section').eq(0);
    
    // Father's name
    if($('.iconMale.add', parentsBlock).length == 0) {
      var fatherNameParts = utils.splitName( $('.iconMale + .nameandyears a', parentsBlock).text() );
      personData['fatherGivenName'] = fatherNameParts[0];
      personData['fatherFamilyName'] = fatherNameParts[1];
    }
    
    // Mother's name
    if($('.iconFemale.add', parentsBlock).length == 0) {
      var motherNameParts = utils.splitName( $('.iconFemale + .nameandyears a', parentsBlock).text() );
      personData['motherGivenName'] = motherNameParts[0];
      personData['motherFamilyName'] = motherNameParts[1];
    }
    
    // Spouse's name
    var spouseBlock = $('.famMem .section').eq(1);
    if($('.add', spouseBlock).length == 0){
      var spouseNameParts = utils.splitName( $('.main .nameandyears a', spouseBlock).text() );
      personData['spouseGivenName'] = spouseNameParts[0];
      personData['spouseFamilyName'] = spouseNameParts[1];
    }
     
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