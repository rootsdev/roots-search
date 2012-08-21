(function(rs){
  
  // DOM references for the search gadget on the person page
  var linksWrapper, loader;
  
  $(document).ready(function(){
    setup();
  });
  
  function setup() {
    if ( rs.getHashParts()['view'] === 'ancestor' ) {
      buildPersonSearchWidget();
    }
  }

  // Builds the search widget on the person page
  function buildPersonSearchWidget() {
    var self = this;
    
    // Create widget
    var searchGadget = $('<div id="recordSearchGadget" class="changeLogGadget summary"><h5>Record Search</h5></div>').prependTo('.sideBar');
    linksWrapper = $('<div id="searchLinkWrap" />').appendTo(searchGadget);
    loader = $('<img id="searchLinkSpinner" src="https://familysearch.org/gadgetrepo/org/familysearch/gadget/gadget-core/1.x/shared/images/spinnerOnTan.gif" />').appendTo(searchGadget);
    
    // Bind to hashchange event
    window.onhashchange = processPersonHash;
    
    // Initial setup
    processPersonHash();
  }
  
  // Called when the person page loads and when the hash changes on the person page
  function processPersonHash() {    
    
    // Remove previous search links and show the ajax loader
    linksWrapper.html('');
    loader.show();
    
    if(window.location.hash) {
      
      // Get personId and spouseId
      var hashParts = rs.getHashParts();
      var personId = hashParts['person'];
      var spouseId = hashParts['spouse'];
      
      // If we have a personId and we are in the ancestor view, build the urls
      if(personId) {
        
        // Get person info; process it when both ajax calls return
        $.when(getPersonSummary(personId), getRelationships(personId,spouseId)).done(function(summary, relationships) {
          
          // Get actual return data
          summary = summary[0];
          relationships = relationships[0];
          var normalizedData = normalizeData(summary, relationships);
          
          // Setup urls
          createPersonSearchLinks(rs.executeLinkBuilders(normalizedData));
          loader.hide();
        }); 
      }
    }
  }
  
  // Adds the search links to the person gadget
  function createPersonSearchLinks(linkData) {
    // Add the links to the widget
    $.each(linkData, function(i, link) {
      $('<a>').addClass('changeType').attr({
        'target': '_blank',
        'href': link.url
      }).html(link.text).appendTo(linksWrapper);
    });
  }
  
  function normalizeData(summary, relationships) {
    var gender = summary.data.gender,
        fatherName = ['',''],
        motherName = ['',''],
        spouseName = ['',''];
    
    // Process parents if there is a relationship
    if( relationships.data.parents.length ) {
      var fatherName = rs.splitName(relationships.data.parents[0].husband.name);
      var motherName = rs.splitName(relationships.data.parents[0].wife.name);
    }
    
    // Process spouse if there is a spouse relationship
    if(relationships.data.spouses.length) {
      if(gender == 'MALE' && relationships.data.spouses[0].wife) {
        spouseName = rs.splitName(relationships.data.spouses[0].wife.name);
      } else if(gender == 'FEMALE' && relationships.data.spouses[0].husband) {
        spouseName = rs.splitName(relationships.data.spouses[0].husband.name);
      }
    }
    
    var data = {
      'givenName': summary.data.nameConclusion.details.givenPart,
      'familyName': summary.data.nameConclusion.details.familyPart,
      'birthPlace': summary.data.birthConclusion.details.place.normalizedText,
      'birthDate': summary.data.birthConclusion.details.date.normalizedText,
      'deathPlace': summary.data.deathConclusion.details.place.normalizedText,
      'deathDate': summary.data.deathConclusion.details.date.normalizedText,
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
  
  // Makes an ajax call to retrieve the persons summary data and returns a promise
  function getPersonSummary(personId) {
    return $.getJSON('https://www.familysearch.org/tree-data/person/'+personId+'/summary');
  }
  
  // Makes an ajax call to retrieve relationship info and returns a promise
  function getRelationships(personId, spouseId) {
    var url = 'https://www.familysearch.org/tree-data/family-members/person/'+personId;
    if(spouseId)
      url += '?spouseId='+spouseId;
    return $.getJSON(url);
  }
}(rs));