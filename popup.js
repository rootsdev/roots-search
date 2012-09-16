$(document).ready(function(){
  
  // Get the id of the tab
  chrome.tabs.query({active: true}, function(tabs){
    
    var bgPage = chrome.extension.getBackgroundPage();
    
    var personData = bgPage.personDataObjects[tabs[0].id];
    
    fillForm(personData);
    
    var searchLinks = bgPage.rs.executeLinkBuilders(personData);
    
    $.each(searchLinks, function(i, link){
      $('<div>')
        .appendTo('#search-links')
        .append( $('<a target="_blank">').html(link.text).attr('href', link.url) );
    });
  });
  
});

function fillForm(personData) {
  $('#first-name').val(personData.givenName);
  $('#last-name').val(personData.familyName);
  $('#birth-date').val(personData.birthDate);
  $('#birth-place').val(personData.birthPlace);
  $('#death-date').val(personData.deathDate);
  $('#death-place').val(personData.deathPlace);
  $('#spouse-first-name').val(personData.spouseGivenName);
  $('#spouse-last-name').val(personData.spouseFamilyName);
  $('#marriage-date').val(personData.marriageDate);
  $('#marriage-place').val(personData.marriagePlace);
  $('#father-first-name').val(personData.fatherGivenName);
  $('#father-last-name').val(personData.fatherFamilyName);
  $('#mother-first-name').val(personData.motherGivenName);
  $('#mother-last-name').val(personData.motherFamilyName);
}