(function(fs){

  fs.registerSearchBuilder('ancestry', createUrl);

  function createUrl(summary, relationships) {
    var ancestryURL = 'http://search.ancestry.com/cgi-bin/sse.dll?rank=1';
    var query = '';
    
    // Process personal information
    query = addQueryParam(query, 'gsfn', summary.data.nameConclusion.details.givenPart);
    query = addQueryParam(query, 'gsln', summary.data.nameConclusion.details.familyPart);
    query = addQueryParam(query, 'mswpn__ftp', summary.data.birthConclusion.details.place.normalizedText);
    query = addQueryParam(query, 'msbdy', fs.getYear(summary.data.birthConclusion.details.date.normalizedText));	
    
    // Process parents
    if(relationships.data.parents.length) {
      var fatherName = fs.splitName(relationships.data.parents[0].husband.name);
      var motherName = fs.splitName(relationships.data.parents[0].wife.name);
      query = addQueryParam(query, 'msfng0', fatherName[0]);
      query = addQueryParam(query, 'msfns0', fatherName[1]);
      query = addQueryParam(query, 'msmng0', motherName[0]);
      query = addQueryParam(query, 'msmns0', motherName[1]);
    }
    
    if(relationships.data.spouses.length) {
      // Process spouse name
      var gender = summary.data.gender;
      var spouseName;
      if(gender == 'MALE' && relationships.data.spouses[0].wife) {
        spouseName = fs.splitName(relationships.data.spouses[0].wife.name);
      } else if(gender == 'FEMALE' && relationships.data.spouses[0].husband) {
        spouseName = fs.splitName(relationships.data.spouses[0].husband.name);
      }
      if(spouseName) {
        query = addQueryParam(query, 'mssng0', spouseName[0]);
        query = addQueryParam(query, 'mssns', spouseName[1]);
      }
      
      // Process marriage info
      if(relationships.data.spouses[0].event) {
        query = addQueryParam(query, 'msgpn__ftp', relationships.data.spouses[0].event.standardPlace);
        query = addQueryParam(query, 'msgdy', fs.getYear(relationships.data.spouses[0].event.standardDate));
      }
    }
    
    // Update link
    return {
      'text': 'Ancestry',
      'url': ancestryURL + query + '&gl=allgs'
    };
  }

  function addQueryParam(query,queryParam,paramValue) {
    if(paramValue) {
      query += '&' + queryParam + '=' + encodeURIComponent(paramValue)
    }	
    return query;
  }

}(fsTreeSearch));