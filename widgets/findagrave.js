(function(utils, undefined){

  /**
   * Setup the widget when the page loads.
   */
  $(document).ready(function(){
    if( utils.getQueryParams()['page'] == 'gr' ) {
      try {
        setup();
      } catch(e) {
        utils.reportError(e, window.location.href);
      }
    }
  });
  
  function setup() {
    
    var nameParts = utils.splitName( $('.plus2').text() );
     
    var personData = {
      'givenName': nameParts[0],
      'familyName': nameParts[1],
      'birthDate': $('td:contains("Birth:"):last').next().html().split('<br>')[0],
      'deathDate': $('td:contains("Death:"):last').next().html().split('<br>')[0]
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