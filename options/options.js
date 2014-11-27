var background = chrome.extension.getBackgroundPage();

$(document).ready(function(){

  $sites = $('#sites').html('');
  
  $.each(background.sites, function(i, site){
    $sites.append(creatSiteDOM(site));
  });

});

function creatSiteDOM(site){
  var dom = $('<div>').addClass('site checkbox'),
      label = $('<label>').text(site.name).appendTo(dom),
      input = $('<input type="checkbox">').prependTo(label).attr('checked', site.enabled);
  input.change(function(){
    site.enabled = $(this).is(':checked');
    console.log('changed');
    background.saveSiteSettings(site);
  });
  return dom;
};