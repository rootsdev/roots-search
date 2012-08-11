(function(fs){

  fs.registerLinkBuilder('ancestry', createUrl);

  function createUrl(pd) {
    var ancestryURL = 'http://search.ancestry.com/cgi-bin/sse.dll?rank=1';
    var query = '';
    
    // Process personal information
    query = addQueryParam(query, 'gsfn', pd.givenName);
    query = addQueryParam(query, 'gsln', pd.familyName);
    query = addQueryParam(query, 'mswpn__ftp', pd.birthPlace);
    query = addQueryParam(query, 'msbdy', fs.getYear(pd.birthDate));	
    
    // Process parents
    query = addQueryParam(query, 'msfng0', pd.fatherGivenName);
    query = addQueryParam(query, 'msfns0', pd.fatherFamilyName);
    query = addQueryParam(query, 'msmng0', pd.motherGivenName);
    query = addQueryParam(query, 'msmns0', pd.motherFamilyName);
    
    // Process spouse name
    query = addQueryParam(query, 'mssng0', pd.spouseGivenName);
    query = addQueryParam(query, 'mssns', pd.spouseFamilyName);
      
    // Process marriage info
    query = addQueryParam(query, 'msgpn__ftp', pd.marriagePlace);
    query = addQueryParam(query, 'msgdy', fs.getYear(pd.marriageDate));
    
    // Update link
    return {
      'text': 'Ancestry',
      'url': ancestryURL + query + '&gl=allgs'
    };
  }

  function addQueryParam(query, queryParam, paramValue) {
    if(paramValue) {
      query += '&' + queryParam + '=' + encodeURIComponent(paramValue)
    }	
    return query;
  }

}(fs));