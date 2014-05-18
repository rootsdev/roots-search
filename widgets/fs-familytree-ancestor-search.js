(function(utils, undefined){
  
  $(document).ready(function(){
    window.onhashchange = processHash;
    
    processHash()
  });
  
  // Called when the hash changes
  function processHash() {    
    
    // Always hide the page action icon when the hash change
    // If we navigated to a new person we need time to load their data
    chrome.extension.sendRequest({
      'type': 'hide'
    });
    
    // Remove previous search links and show the ajax loader
    var hashParts = utils.getHashParts();
    
    if( hashParts['view'] == 'ancestor' ) {
      
      // Get personId and spouseId
      var personId = hashParts['person'];
      var spouseId = hashParts['spouse'];
      
      // If we have a personId and we are in the ancestor view, build the urls
      if(personId) {
        
        // Get person info; process it when both ajax calls return
        $.when(getPersonSummary(personId), getRelationships(personId,spouseId)).done(function(summary, relationships) {
          
          try {
            // Get actual return data
            summary = summary[0];
            relationships = relationships[0];
            var personData = normalizeData(summary, relationships);
            
            chrome.extension.sendRequest({
              'type': 'person_info',
              'data': personData
            });
          } catch(e) {
            utils.reportError(e, window.location.href);
          }
        }); 
      }
    }
  }
  
  function normalizeData(summary, relationships) {
    var gender = summary.data.gender,
        fatherName = ['',''],
        motherName = ['',''],
        spouseName = ['',''];
    
    // Process parents if there is a relationship
    if( relationships.data.parents.length ) {
      var fatherName = utils.splitName(relationships.data.parents[0].husband.name);
      var motherName = utils.splitName(relationships.data.parents[0].wife.name);
    }
    
    // Process spouse if there is a spouse relationship
    if(relationships.data.spouses.length) {
      if(gender == 'MALE' && relationships.data.spouses[0].wife) {
        spouseName = utils.splitName(relationships.data.spouses[0].wife.name);
      } else if(gender == 'FEMALE' && relationships.data.spouses[0].husband) {
        spouseName = utils.splitName(relationships.data.spouses[0].husband.name);
      }
    }
    
    var data = {
      'givenName': getSummaryInfo(summary, ['data', 'nameConclusion', 'details', 'nameForms', 0, 'givenPart']),
      'familyName': getSummaryInfo(summary, ['data', 'nameConclusion', 'details', 'nameForms', 0, 'familyPart']),
      'birthPlace': getSummaryInfo(summary, ['data', 'birthConclusion', 'details', 'place', 'normalizedText']),
      'birthDate': getSummaryInfo(summary, ['data', 'birthConclusion', 'details', 'date', 'normalizedText']),
      'deathPlace': getSummaryInfo(summary, ['data', 'deathConclusion', 'details', 'place', 'normalizedText']),
      'deathDate': getSummaryInfo(summary, ['data', 'deathConclusion', 'details', 'date', 'normalizedText']),
      'fatherGivenName': fatherName[0],
      'fatherFamilyName': fatherName[1],
      'motherGivenName': motherName[0],
      'motherFamilyName': motherName[1],
      'spouseGivenName': spouseName[0],
      'spouseFamilyName': spouseName[1]
    };
    
    if(relationships.data.spouses[0].event) {
      data.marriageDate = relationships.data.spouses[0].event.standardDate;
      data.marriagePlace = relationships.data.spouses[0].event.standardPlace;
    }
    
    return data;
  }
  
  // Iterate over a list of attributes which define the path
  // through an object to a desired piece of data. Stop when
  // we reach the last attribute (and return its value)
  // or when we find something that is undefined (return undefined)
  function getSummaryInfo(summary, attributes) {
    var current = summary;
    for(var i = 0; i < attributes.length; i++) {
      current = current[attributes[i]];
      if( current == undefined ) {
        return undefined;
      }
    }
    return current;
  }
  
  // Makes an ajax call to retrieve the persons summary data and returns a promise
  function getPersonSummary(personId) {
    return $.getJSON('https://familysearch.org/tree-data/person/'+personId+'/summary');
  }
  
  // Makes an ajax call to retrieve relationship info and returns a promise
  function getRelationships(personId, spouseId) {
    var url = 'https://familysearch.org/tree-data/family-members/person/'+personId;
    if(spouseId)
      url += '?spouseId='+spouseId;
    return $.getJSON(url);
  }
}(utils));