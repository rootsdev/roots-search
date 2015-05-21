// Set the debug flag if the extension isn't installed via the webstore
var debug = chrome.app.getDetails().update_url ? false : true;

var personDataObjects = {};

loadSiteSettings();

_gaq.push(['_trackEvent', 'Start', 'Version', chrome.app.getDetails().version]);

chrome.extension.onRequest.addListener(function(request, sender) {

  if( request.type == "person_info" ) {
    
    // Verify format of dates; they cause errors if they're not valid
    if( typeof request.data.birthDate !== 'undefined' && !isValidDate(request.data.birthDate) ) {
      if( debug ) {
        console.error('Bad birth date: ' + request.data.birthDate);
      }
      request.data.birthDate = undefined;
      _gaq.push(['_trackEvent', 'Error', 'Bad Birth Date', sender.tab.url]);
    }
    if( typeof request.data.deathDate !== 'undefined' && !isValidDate(request.data.deathDate) ) {
      if( debug ) {
        console.error('Bad death date: ' + request.data.deathDate);
      }
      request.data.deathDate = undefined;
      _gaq.push(['_trackEvent', 'Error', 'Bad Death Date', sender.tab.url]);
    }
    
    // Show the RootsSearch icon
    chrome.pageAction.show(sender.tab.id);
    
    // Store the data so that the popup can retrieve it
    personDataObjects[sender.tab.id] = {
      'original': request.data,
      'url': sender.tab.url
    };
    
    _gaq.push(['_trackEvent', 'Data', 'Process', sender.tab.url]);
  }
  
  else if( request.type == "hide" ) {
    chrome.pageAction.hide(sender.tab.id);
  }
  
  else if( request.type == "js_error" ) {
    request.data.message += "\n\nRootsSearch version" + chrome.app.getDetails().version;
    $.post('https://rs-errors.herokuapp.com', request.data);
    if( debug ) {
      console.log(request.data);
    }
    _gaq.push(['_trackEvent', 'Error', 'JS', sender.tab.url]);
  }
  
  else if( request.type == "visit" ) {
    _gaq.push(['_trackPageview', sender.tab.url]);
    _gaq.push(['_trackEvent', 'Visit', 'Record', sender.tab.url]);
  }
  
});

function isValidDate(d) {
  d = new Date(d);
  if ( Object.prototype.toString.call(d) !== "[object Date]" )
    return false;
  return !isNaN(d.getTime());
};

/**
 * Load the site settings from local storage
 * and update default site settings
 */
function loadSiteSettings(){

  var siteKeys = [];
  $.each(sites, function(i, site){
    siteKeys.push(getSiteSettingsKey(site.key));
  });

  chrome.storage.local.get(siteKeys, function(savedSettings){    
    $.each(sites, function(i, site){
      var settingsKey = getSiteSettingsKey(site.key);
      if(savedSettings[settingsKey]){
        $.extend(site, savedSettings[settingsKey]); 
      }
    });   
  });

};

function getSiteSettingsKey(siteKey){
  return 'site-' + siteKey;
};

/**
 * Save site settings, but not the name.
 */
function saveSiteSettings(site){
  var save = {};
  save[getSiteSettingsKey(site.key)] = {
    enabled: site.enabled
  };
  chrome.storage.local.set(save);
};