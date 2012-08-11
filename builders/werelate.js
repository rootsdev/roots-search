(function(fs){

  fs.registerLinkBuilder('werelate', createUrl);

  function createUrl(pd) {
    var baseUrl = 'http://www.werelate.org/wiki/Special:Search?sort=score&ns=Person&a=&st=&hg=&hs=&wg=&ws=&md=&mr=0&mp=&pn=&li=&su=&sa=&t=&k=&rows=20&ecp=p';
    var query = '';
    
    // Process personal information
    query = addQueryParam(query, 'g', pd.givenName);
    query = addQueryParam(query, 's', pd.familyName);
    
    // Birth
    query = addQueryParam(query, 'bp', pd.birthPlace);
    query = addQueryParam(query, 'bd', convertDate(pd.birthDate));
    query = addQueryParam(query, 'br', 5);
    
    // Death
    query = addQueryParam(query, 'dp', pd.deathPlace);
    query = addQueryParam(query, 'dd', convertDate(pd.deathDate));
    query = addQueryParam(query, 'dr', 5);
    
    // Process parents
    query = addQueryParam(query, 'fg', pd.fatherGivenName);
    query = addQueryParam(query, 'fs', pd.fatherFamilyName);
    query = addQueryParam(query, 'mg', pd.motherGivenName);
    query = addQueryParam(query, 'ms', pd.motherFamilyName);
    
    // Process spouse name
    query = addQueryParam(query, 'sg', pd.spouseGivenName);
    query = addQueryParam(query, 'ss', pd.spouseFamilyName);
    
    // Update link
    return {
      'text': 'WeRelate.org',
      'url': baseUrl + query
    };
  }

  function addQueryParam(query, queryParam, paramValue) {
    if(paramValue) {
      query += '&' + queryParam + '=' + encodeURIComponent(paramValue)
    }	
    return query;
  }
  
  function convertDate(date) {
    var date = new Date(date);
    return [date.getDate(), date.getShortMonthName(), date.getFullYear()].join(' ');
  }

}(fs));