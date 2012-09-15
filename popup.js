$(document).ready(function(){
  
  // Get the id of the tab
  chrome.tabs.query({active: true}, function(tabs){
    
    var bgPage = chrome.extension.getBackgroundPage();
    
    var personInfo = bgPage.personInfoObjects[tabs[0].id];
    
    var searchLinks = bgPage.rs.executeLinkBuilders(personInfo);
    
    $.each(searchLinks, function(i, link){
      $('<div>')
        .appendTo('#search-links')
        .append( $('<a target="_blank">').html(link.text).attr('href', link.url) );
    });
  });
  
});