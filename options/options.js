var background = chrome.extension.getBackgroundPage();

$(document).ready(function(){

  $sites = $('#sites').html('');
  
  $.each(background.sites, function(i, site){
    $sites.append(
      $('<tr>').append(
        $('<td>').append(creatSiteDOM(site))
      )
    );
  });
  
  $('#feedback-link').click(function(){
    _gaq.push(['_trackEvent','Links','Click','Feedback']);
  });

});

function creatSiteDOM(site){
  var dom = $('<div>').addClass('site checkbox').addClass(site.enabled ? '' : 'rs-disabled'),
      label = $('<label>').text(site.name).appendTo(dom),
      input = $('<input type="checkbox">').prependTo(label).attr('checked', site.enabled),
      url = $('<div class="site-url"><a target="_blank" href="' + site.url + '">' + site.url + '</a></div>').appendTo(dom);
  
  input.change(function(){
    site.enabled = $(this).is(':checked');
    background.saveSiteSettings(site);
    if(site.enabled){
      dom.removeClass('rs-disabled');
      _gaq.push(['_trackEvent','Options','Enable',site.name]);
    } else {
      dom.addClass('rs-disabled');
      _gaq.push(['_trackEvent','Options','Disable',site.name]);
    }
  });
  
  return dom;
};