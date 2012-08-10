(function(fs){

  fs.registerSearchBuilder('werelate', createUrl);

  function createUrl(summary, relationships) {
    var baseUrl = 'http://www.werelate.org/wiki/Special:Search?sort=score&ns=Person&a=&st=&hg=&hs=&wg=&ws=&md=&mr=0&mp=&pn=&li=&su=&sa=&t=&k=&rows=20&ecp=p';
    var query = '';
    
    // Name
    query = addQueryParam(query, 'g', summary.data.nameConclusion.details.givenPart);
    query = addQueryParam(query, 's', summary.data.nameConclusion.details.familyPart);
    
    // Birth
    query = addQueryParam(query, 'bp', summary.data.birthConclusion.details.place.normalizedText);
    query = addQueryParam(query, 'bd', convertDate(summary.data.birthConclusion.details.date.normalizedText));
    query = addQueryParam(query, 'br', 5);
    
    // Death
    query = addQueryParam(query, 'dp', summary.data.deathConclusion.details.place.normalizedText);
    query = addQueryParam(query, 'dd', convertDate(summary.data.deathConclusion.details.date.normalizedText));
    query = addQueryParam(query, 'dr', 5);
    
    // Process parents
    if(relationships.data.parents.length) {
      var fatherName = fs.splitName(relationships.data.parents[0].husband.name);
      var motherName = fs.splitName(relationships.data.parents[0].wife.name);
      query = addQueryParam(query, 'fg', fatherName[0]);
      query = addQueryParam(query, 'fs', fatherName[1]);
      query = addQueryParam(query, 'mg', motherName[0]);
      query = addQueryParam(query, 'ms', motherName[1]);
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
        query = addQueryParam(query, 'sg', spouseName[0]);
        query = addQueryParam(query, 'ss', spouseName[1]);
      }
    }
    
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

}(fsTreeSearch));