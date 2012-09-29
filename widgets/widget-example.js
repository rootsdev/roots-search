(function(utils, undefined){

  /**
   * Setup the widget when the page loads.
   */
  $(document).ready(function(){
    setup();
  });
  
  function setup() {
    
    /**
     * First we retrieve the data on the screen. How this is done depends
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