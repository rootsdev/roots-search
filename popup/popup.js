var bgPage;

$(document).ready(function(){
  
  // Get the id of the tab
  chrome.tabs.query({active: true}, function(tabs){
    
    bgPage = chrome.extension.getBackgroundPage();
    
    var personData = bgPage.personDataObjects[tabs[0].id];
    
    fillForm(personData);
    
    $('#update-button').attr('disabled', false).click(function(){
      updateLinks();
    });
    
    updateLinks();
    
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

function updateLinks() {
  
  // Delete previous links and show ajax loader for a moment
  $('#search-links').html('<img class="loader" src="../images/ajax-loader.gif">');
  
  setTimeout(buildLinks, 300);
  
}

function buildLinks() {
  
  var personData = {
    givenName: $('#first-name').val(),
    familyName: $('#last-name').val(),
    birthDate: $('#birth-date').val(),
    birthPlace: $('#birth-place').val(),
    deathDate: $('#death-date').val(),
    deathPlace: $('#death-place').val(),
    spouseGivenName: $('#spouse-first-name').val(),
    spouseFamilyName: $('#spouse-last-name').val(),
    marriageDate: $('#marriage-date').val(),
    marriagePlace: $('#marriage-place').val(),
    fatherGivenName: $('#father-first-name').val(),
    fatherFamilyName: $('#father-last-name').val(),
    motherGivenName: $('#mother-first-name').val(),
    motherFamilyName: $('#mother-last-name').val()
  };
  
  var searchLinks = bgPage.rs.executeLinkBuilders(personData);
  
  // Remove ajax loader and add search links
  $('#search-links').html('');
  $.each(searchLinks, function(i, link){
      $('<a target="_blank">').addClass('btn btn-info').html(link.text).attr('href', link.url).appendTo('#search-links');
  });
  
}