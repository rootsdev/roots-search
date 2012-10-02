(function(utils, undefined){

  /**
   * Setup the widget when the page loads.
   */
  $(document).ready(function(){
    setup();
  });
  
  function setup() {
    
    var nameParts = utils.splitName( $('.info_record_name').text() );
    
    var personData = {
      'givenName': nameParts[0],
      'familyName': nameParts[1],
      'birthDate': $('.birth_date').text(),
      'deathDate': $('.death_date').text()
    };
     
    /**
     * Now we send the data to the background script that
     * will activate the popup icon in the address bar
     */
     
    chrome.extension.sendRequest({
      'type': 'person_info',
      'data': personData
    });
    
  }

}(utils));