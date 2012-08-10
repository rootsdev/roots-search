var fsTreeSearch = {
  // List of link builders that have been registered
  builders: {},
  
  // DOM references for the search gadget on the person page
  personSearchGadget: { 
    linksWrapper: null,
    loader: null
  },
  
  // Function for register link builders
  registerSearchBuilder: function(name, handler) {
    this.builders[name] = {'handler': handler};
  },
  
  // Builds the search widget on the person page
  buildPersonSearchWidget: function() {
    var self = this;
    
    // Create widget
    var searchGadget = $('<div id="recordSearchGadget" class="changeLogGadget summary"><h5>Record Search</h5></div>').prependTo('.sideBar');
    self.personSearchGadget.linksWrapper = $('<div id="searchLinkWrap" />').appendTo(searchGadget);
    self.personSearchGadget.loader = $('<img id="searchLinkSpinner" src="https://familysearch.org/gadgetrepo/org/familysearch/gadget/gadget-core/1.x/shared/images/spinnerOnTan.gif" />').appendTo(searchGadget);
    
    // Bind to hashchange event
    window.onhashchange = function(){
      self.processPersonHash();
    }
    
    // Initial setup
    self.processPersonHash();
  },
  
  // Called when the person page loads and when the hash changes on the person page
  processPersonHash: function() {
    var self = this;      
    
    // Remove previous search links and show the ajax loader
    self.personSearchGadget.linksWrapper.html('');
    self.personSearchGadget.loader.show();
    
    if(window.location.hash) {
      
      // Get personId and spouseId
      var hashParts = self.getHashParts();
      var personId = hashParts['person'];
      var spouseId = hashParts['spouse'];
      
      // If we have a personId and we are in the ancestor view, build the urls
      if(personId) {
        
        // Get person info; process it when both ajax calls return
        $.when(self.getPersonSummary(personId), self.getRelationships(personId,spouseId)).done(function(summary, relationships) {
          
          // Get actual return data
          summary = summary[0];
          relationships = relationships[0];
          
          // Setup urls
          self.createPersonSearchLinks(summary, relationships);
          self.personSearchGadget.loader.hide();
        }); 
      }
    }
  },
  
  // Adds the search links to the person gadget
  createPersonSearchLinks: function(summary, relationships) {
    var self = this,
        linkData = this.executeBuilders(summary, relationships);
    
    // Add the links to the widget
    $.each(linkData, function(i, link) {
      $('<a>').addClass('changeType').attr({
        'target': '_blank',
        'href': link.url
      }).html(link.text).appendTo(self.personSearchGadget.linksWrapper);
    });
  },
  
  // Returns an array of search link objects
  // gathered by executing the builders
  executeBuilders: function(summary, relationships) {
    var linkData = [];
    
    // Loop through the builders and call the handlers if they exist
    $.each(this.builders, function(builderName, builder) {
      if( builder.handler ) {
        // Execute the handlers
        var builderLinkData = builder.handler(summary, relationships);
        
        // Be forgiving and allow the handlers to return either a solo object or an array of objects
        if( $.isArray(builderLinkData) ) {
          $.merge(linkData, builderLinkData);
        } else {
          linkData.push(builderLinkData);
        }
      }
    });
    
    return linkData;
  },
  
  // Makes an ajax call to retrieve the persons summary data and returns a promise
  getPersonSummary: function(personId) {
    return $.getJSON('https://www.familysearch.org/tree-data/person/'+personId+'/summary');
  },
  
  // Makes an ajax call to retrieve relationship info and returns a promise
  getRelationships: function(personId, spouseId) {
    var url = 'https://www.familysearch.org/tree-data/family-members/person/'+personId;
    if(spouseId)
      url += '?spouseId='+spouseId;
    return $.getJSON(url);
  },
  
  // Returns the hash values as a map {key:value}
  getHashParts: function() {
    var hashParts = {};
    $.each(window.location.hash.substring(1).split('&'), function(i, part) {
      var partPieces = part.split('=');
      hashParts[partPieces[0]] = partPieces[1];
    });
    return hashParts;
  },
  
  // Parses a date string (d mm Y) and returns the year as an integer
  // TODO: use JavaScript Date object to parse? why not return undefined?
  getYear: function(date) {
    if(!date) {
      return 0;
    }
    var dateParts = date.split(/\s/);
    var lastPart = parseInt(dateParts[dateParts.length-1],10);
    if(lastPart > 1000) {
      return lastPart;
    }
    return 0;
  },
  
  // Returns an array with [0] being the given names and [1] being the family name
  // This function assumes that there is only one family name
  processName: function(name) {
    // Get given names and last name
    return name.split(/\s+(?=\S*$)/);
  }
};
  
$(document).ready(function(){  
  if ( window.location.pathname === '/tree/' && fsTreeSearch.getHashParts()['view'] === 'ancestor' ) {
    fsTreeSearch.buildPersonSearchWidget();
  }
});