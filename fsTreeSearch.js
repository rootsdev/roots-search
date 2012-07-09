// Getting the action search results list is not going to be trivial

var searchGadget;
var searchGadgetRecordList;
var searchGadgetFSLink;
var searchGadgetAncestryLink;
var searchGadgetLinkWrap;

$(document).ready(function(){  
  if ( window.location.pathname == '/tree/' ) {
    buildSearchWidget();
  } else if ( window.location.pathname.indexOf('/links-gadget/linkpage.jsp') == 0 && window.location.hash == "#asp" ) {
    buildSourceAutoFill();
  }
});

/**
 * Automatically fill in the title and citation of
 * a record when the url is filled in.
 */
function buildSourceAutoFill() {
  // Bind to the change event because that's is the only
  // reliable to check the value. If we bind to key events
  // we will fire off too many useless AJAX calls
  $("#ces_urlText").on("change",function(){
    var url = $(this).val();
    // Process FamilySearch record urls
    if( url.indexOf( 'familysearch.org/pal:/' ) != -1 ) {
      // Show spinner
      var loader = $('<img id="recordLoadSpinner" src="https://familysearch.org/gadgetrepo/org/familysearch/gadget/gadget-core/1.x/shared/images/spinnerOnWhite.gif" />').appendTo("#ces_urlTitle");
      $.get(url,function(html) {
        var sourcePage = $(html);
        // Get title if it hasn't already been specified
        if($("#ces_sourceTitleText").val().indexOf('Example: ') == 0) {
          $("#ces_sourceTitleText").val($("#collection-title",sourcePage).text()).focus();
        }
        // Get citation if it hasn't already been specified
        if($("#ces_citationText").val().indexOf('Example: ') == 0) {
          $("#ces_citationText").val($("#citation p", sourcePage).text()).focus();
        }
        // Move focus to notes field
        $("#ces_citationInfoText").focus();
        // Hide spinner
        loader.hide();
      });
    }
  });
}

function buildSearchWidget() {
  // Create widget
  searchGadget = $('<div id="recordSearchGadget" class="changeLogGadget summary"><h5>Record Search</h5></div>').prependTo('.sideBar');
  searchGadgetRecordList = $('<div class="recordList" />').appendTo(searchGadget);
  searchGadgetLinkWrap = $('<div id="searchLinkWrap" />').appendTo(searchGadget);
  searchGadgetFSLink = $('<a href="#" class="changeType" target="_blank">FamilySearch</a>').appendTo(searchLinkWrap).hide();
  searchGadgetAncestryLink = $('<a href="#" class="changeType" target="_blank">Ancestry</a>').appendTo(searchLinkWrap).hide();
  searchGadgetLoader = $('<img id="searchLinkSpinner" src="https://familysearch.org/gadgetrepo/org/familysearch/gadget/gadget-core/1.x/shared/images/spinnerOnTan.gif" />').appendTo(searchGadget);
  
  // Bind to hashchange event
  window.onhashchange = processHash;
  
  // Initial setup
  processHash();
}

function processHash(){
  $('a', searchLinkWrap).hide();
  searchGadgetLoader.show();
  if(window.location.hash) {
    // Get personID
    var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
    var hashParts = hash.split('&');
    var personId = '';
    var spouseId = '';
    var ancestorView = false;
    
    $.each(hashParts, function(i,part) {
      var partPieces = part.split('=');
      if(partPieces[0] == 'person') {
        personId = partPieces[1];
      }
      if(partPieces[0] == 'spouse') {
        spouseId = partPieces[1];
      }
      if(partPieces[0] == 'view' && partPieces[1] == 'ancestor') {
        ancestorView = true;
      }
    });
    
    if(ancestorView && personId) {
      createURLs(personId, spouseId);
    }
  }
}

function createURLs(personId, spouseId) {
  // Get info; process it when both ajax calls return
  $.when(getSummary(personId),getRelationships(personId,spouseId)).done(function(summary, relationships) {
    // Get actual return data
    summary = summary[0];
    relationships = relationships[0];
    
    // Setup urls
    createFSURL(summary, relationships);
    createAncestryURL(summary, relationships);
    searchGadgetLoader.hide();
  }); 
}

function createFSURL(summary, relationships) {
  var fsURL = 'https://familysearch.org/search/records/index#count=20&query=';
  
  var birthYear = getYear(summary.data.birthConclusion.details.date.normalizedText);
  var gender = summary.data.gender;
  
  // Process summary info
  var query = '';
  query = addFSQueryParam(query,'givenname',summary.data.nameConclusion.details.givenPart);
  query = addFSQueryParam(query,'surname',summary.data.nameConclusion.details.familyPart);
  query = addFSQueryParam(query,'birth_place',summary.data.birthConclusion.details.place.normalizedText);
  if(birthYear) {
    query = addFSQueryParam(query,'birth_year',(birthYear-10)+'-'+(birthYear+10));
  }
  
  /**
   * The surnames of the parents and spouse are commented out because
   * they usually decrease the quality of results when included
   */
  
  // Process parents
  if(relationships.data.parents.length) {
    var fatherName = processName(relationships.data.parents[0].husband.name);
    var motherName = processName(relationships.data.parents[0].wife.name);
    query = addFSQueryParam(query,'father_givenname',fatherName[0]);
    //query = addFSQueryParam(query,'father_surname',fatherName[1]);
    query = addFSQueryParam(query,'mother_givenname',motherName[0]);
    //query = addFSQueryParam(query,'mother_surname',motherName[1]);
  }
  
  if(relationships.data.spouses.length) {
    // Process spouse
    var spouseName;
    if(gender == 'MALE' && relationships.data.spouses[0].wife) {
      spouseName = processName(relationships.data.spouses[0].wife.name);
    } else if(gender == 'FEMALE' && relationships.data.spouses[0].husband) {
      spouseName = processName(relationships.data.spouses[0].husband.name);
    }
    if(spouseName) {
      query = addFSQueryParam(query,'spouse_givenname',spouseName[0]);
      //query = addFSQueryParam(query,'spouse_surname',spouseName[1]);
    }
    
    // Process marriage info
    if(relationships.data.spouses[0].event) {
      var marriageYear = getYear(relationships.data.spouses[0].event.standardDate);
      query = addFSQueryParam(query,'marriage_place',relationships.data.spouses[0].event.standardPlace);
      query = addFSQueryParam(query,'marriage_year',(marriageYear-10)+'-'+(marriageYear+10));
    }
  }
  
  // Update link
  searchGadgetFSLink.attr({'href':fsURL + encodeURIComponent(query)}).show();
}

function createAncestryURL(summary, relationships) {
  var ancestryURL = 'http://search.ancestry.com/cgi-bin/sse.dll?rank=1';
  var query = '';
  
  // Process personal information
  query = addAncestryQueryParam(query,'gsfn',summary.data.nameConclusion.details.givenPart);
	query = addAncestryQueryParam(query,'gsln',summary.data.nameConclusion.details.familyPart);
	query = addAncestryQueryParam(query,'mswpn__ftp',summary.data.birthConclusion.details.place.normalizedText);
	query = addAncestryQueryParam(query,'msbdy',getYear(summary.data.birthConclusion.details.date.normalizedText));	
  
  // Process parents
  if(relationships.data.parents.length) {
    var fatherName = processName(relationships.data.parents[0].husband.name);
    var motherName = processName(relationships.data.parents[0].wife.name);
    query = addAncestryQueryParam(query,'msfng0',fatherName[0]);
    query = addAncestryQueryParam(query,'msfns0',fatherName[1]);
    query = addAncestryQueryParam(query,'msmng0',motherName[0]);
    query = addAncestryQueryParam(query,'msmns0',motherName[1]);
  }
  
  if(relationships.data.spouses.length) {
    // Process spouse name
    var gender = summary.data.gender;
    var spouseName;
    if(gender == 'MALE' && relationships.data.spouses[0].wife) {
      spouseName = processName(relationships.data.spouses[0].wife.name);
    } else if(gender == 'FEMALE' && relationships.data.spouses[0].husband) {
      spouseName = processName(relationships.data.spouses[0].husband.name);
    }
    if(spouseName) {
      query = addAncestryQueryParam(query,'mssng0',spouseName[0]);
      query = addAncestryQueryParam(query,'mssns',spouseName[1]);
    }
    
    // Process marriage info
    if(relationships.data.spouses[0].event) {
      query = addAncestryQueryParam(query,'msgpn__ftp',relationships.data.spouses[0].event.standardPlace);
      query = addAncestryQueryParam(query,'msgdy',getYear(relationships.data.spouses[0].event.standardDate));
    }
  }
  
  // Update link
  searchGadgetAncestryLink.attr({'href':ancestryURL + query + '&gl=allgs'}).show();
}

function addAncestryQueryParam(query,queryParam,paramValue) {
	if(paramValue) {
		query += '&' + queryParam + '=' + encodeURIComponent(paramValue)
	}	
	return query;
}

function getSummary(personId) {
  return $.getJSON('https://www.familysearch.org/tree-data/person/'+personId+'/summary');
}

function getRelationships(personId,spouseId) {
  var url = 'https://www.familysearch.org/tree-data/family-members/person/'+personId;
  if(spouseId)
    url += '?spouseId='+spouseId;
  return $.getJSON(url);
}

function addFSQueryParam(query,queryParam,paramValue) {
  if(paramValue){
    if(query) {
      query += ' ';
    }
    query += '+' + queryParam + ':';
    // if the value has a space, wrap it in quotes      
    if(paramValue.indexOf(' ') >= 0) {
      query += '"' + paramValue + '"~';
    } else {
      query += paramValue + '~';
    }
  }
  return query;
}

function getYear(birthDate) {
  if(!birthDate) {
    return 0;
  }
  var dateParts = birthDate.split(/\s/);
  var lastPart = parseInt(dateParts[dateParts.length-1],10);
  if(lastPart > 1000) {
    return lastPart;
  }
  return 0;
}

function processName(name) {
  // Get given names and last name
  return name.split(/\s+(?=\S*$)/);
}