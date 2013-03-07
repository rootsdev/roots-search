(function(rs){

  rs.registerLinkBuilder({
    'text': 'WeRelate', 
    'func': createUrl
  });

  function createUrl(pd) {
    var baseUrl = 'http://www.werelate.org/wiki/Special:Search?sort=score&ns=Person&rows=20&ecp=p';
    var query = '';
    
    // Simple mappings from the person data object to ancestry params
    // These don't need any further processing
    var mappings = [
      ['g', 'givenName'],
      ['s', 'familyName'],
      ['bp', 'birthPlace'],
      ['dp', 'deathPlace'],
      ['fg', 'fatherGivenName'],
      ['fs', 'fatherFamilyName'],
      ['mg', 'motherGivenName'],
      ['ms', 'motherFamilyName'],
      ['sg', 'spouseGivenName'],
      ['ss', 'spouseFamilyName']
    ];    
    $.each(mappings, function(i, m) {
      if( pd[m[1]] ) {
        query = addQueryParam(query, m[0], pd[m[1]]);
      }
    });
    
    // Process dates and add the ranges
    if( pd.birthDate ) {
      query = addQueryParam(query, 'bd', convertDate(pd.birthDate));
      query = addQueryParam(query, 'br', 5);
    }
    if( pd.deathDate ) {
      query = addQueryParam(query, 'dd', convertDate(pd.deathDate));
      query = addQueryParam(query, 'dr', 5);
    }
    
    return baseUrl + query;
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

}(rs));

// The following lines extend the date object to
// all for retrieving month names (long and short)
Date.prototype.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];
Date.prototype.getMonthName = function() {
    return this.monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
    return this.getMonthName().substr(0, 3);
};