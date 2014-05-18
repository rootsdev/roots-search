String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var bgPage, tabId;
var mappings = [
  ['givenName', 'first-name'],
  ['familyName', 'last-name'],
  ['birthDate', 'birth-date'],
  ['birthPlace', 'birth-place'],
  ['deathDate', 'death-date'],
  ['deathPlace', 'death-place'],
  ['spouseGivenName', 'spouse-first-name'],
  ['spouseFamilyName', 'spouse-last-name'],
  ['fatherGivenName', 'father-first-name'],
  ['fatherFamilyName', 'father-last-name'],
  ['motherGivenName', 'mother-first-name'],
  ['motherFamilyName', 'mother-last-name']
];

$(document).ready(function(){
  
  // Create input fields
  $.each(mappings, function(i, vals){
    var properLabel = vals[1].replace(/\-/g,' ').toProperCase();
    var fieldWrap = $('<div>').addClass('field-wrap span2')
      .append( $('<div>').addClass('field-label').html(properLabel) )
      .append( 
        $('<input>').addClass('span2').attr({'id': vals[1], 'type': 'text'}).change(function(){
          _gaq.push(['_trackEvent', 'Data', 'Change', properLabel]);
          personData = bgPage.personDataObjects[tabId]['updated'] = getPersonData();
        })        
      )
      .appendTo('#form');
  });
  
  // Get the id of the tab
  chrome.tabs.query({active: true}, function(tabs){
    
    bgPage = chrome.extension.getBackgroundPage();
    tabId = tabs[0].id;
    
    var personData = bgPage.personDataObjects[tabId]['original'];
    if( bgPage.personDataObjects[tabId]['updated'] ) {
      personData = bgPage.personDataObjects[tabId]['updated'];
    }
    
    // Push the domain to Google Analytics
    var pageUrl = bgPage.personDataObjects[tabId].url;
    _gaq.push(['_trackPageview', '/popup/' + pageUrl]);
    _gaq.push(['_trackEvent', 'Popup', 'Open', pageUrl.split('/')[2]]);
    
    fillForm(personData);
    
    createLinkButtons();
    
  });
  
  // Track clicks on feedback link
  $('#feedback-link').click(function(){
    _gaq.push(['_trackEvent','Links','Click','Feedback']);
  });
  
});

function fillForm(personData) {
  $.each(mappings, function(i, vals){
    $('#'+vals[1]).val(personData[vals[0]]);
  });
}

function getPersonData() {
  var personData = {};
  $.each(mappings, function(i, vals){
    personData[vals[0]] = $('#'+vals[1]).val();
  });
  return personData;
}

function createLinkButtons() {
  $.each(bgPage.sites, function(gensearchSite, displayName) {
    $('<button>').addClass('btn btn-info').html(displayName).appendTo('#search-links').click(function(){
      var searchUrl = gensearch(gensearchSite, getPersonData());     
      window.open(searchUrl);     
      _gaq.push(['_trackEvent', 'Links', 'Click', displayName]);
    });
  });
}