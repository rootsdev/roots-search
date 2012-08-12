(function(rs){

  rs.registerLinkBuilder('ancestry', createUrl);

  function createUrl(pd) {
    var ancestryURL = 'http://search.ancestry.com/cgi-bin/sse.dll?rank=1';
    var query = '';
    
    // Simple mappings from the person data object to ancestry params
    // These don't need any further processing
    var mappings = [
      ['gsfn', 'givenName'],
      ['gsln', 'familyName'],
      ['msbpn__ftp', 'birthPlace'],
      ['msdpn__ftp', 'deathPlace'],
      ['msfng0', 'fatherGivenName'],
      ['msfns0', 'fatherFamilyName'],
      ['msmng0', 'motherGivenName'],
      ['msmns0', 'motherFamilyName'],
      ['mssng0', 'spouseGivenName'],
      ['mssns', 'spouseFamilyName'],
      ['msgpn__ftp', 'marriagePlace']
    ];    
    $.each(mappings, function(i, m) {
      if( pd[m[1]] ) {
        query = addQueryParam(query, m[0], pd[m[1]]);
      }
    });
    
    // Process dates
    query = addQueryParam(query, 'msbdy', rs.getYear(pd.birthDate));
    query = addQueryParam(query, 'msddy', rs.getYear(pd.deathDate));
    query = addQueryParam(query, 'msgdy', rs.getYear(pd.marriageDate));
    
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

}(rs));