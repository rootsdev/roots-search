(function(fs){

  fs.registerLinkBuilder('familysearch', createUrl);

  function createUrl(pd) {
    var fsURL = 'https://familysearch.org/search/records/index#count=20&query=';
    var query = '';
    
    /**
     * The surnames of the parents and spouse are commented out because
     * they usually decrease the quality of results when included
     */
    
    // Simple mappings from the person data object to fs params
    // These don't need any further processing
    var simpleMappings = [
      ['givenname', 'givenName'],
      ['surname', 'familyName'],
      ['birth_place', 'birthPlace'],
      ['father_givenname', 'fatherGivenName'],
      // ['father_surname', 'fatherFamilyName'],
      ['mother_givenname', 'motherGivenName'],
      // ['mother_surname', 'motherFamilyName'],
      ['spouse_givenname', 'spouseGivenName'],
      // ['spouse_surname', 'spouseFamilyName'],
      ['marriage_place', 'marriagePlace']
    ];    
    $.each(simpleMappings, function(i, m) {
      if( pd[m[1]] ) {
        query = addQueryParam(query, m[0], pd[m[1]]);
      }
    });
    
    // Process the birth year    
    var birthYear = fs.getYear(pd.birthDate);
    if( birthYear ) {
      query = addQueryParam(query, 'birth_year', (birthYear-10)+'-'+(birthYear+10));
    }

    // Process the marriage year
    var marriageYear = fs.getYear(pd.marriageDate);
    if( marriageYear ) {
      query = addQueryParam(query, 'marriage_year', (marriageYear-10)+'-'+(marriageYear+10));
    }
    
    return {
      'text': 'FamilySearch',
      'url': fsURL + encodeURIComponent(query)
    };
  }
  
  function addQueryParam(query, queryParam, paramValue) {
    if(paramValue){
      if(query) {
        query += ' ';
      }
      query += '+' + queryParam + ':';
      // if the value has a space, wrap it in quotes      
      if(paramValue.indexOf(' ') >= 0) {
        query += '"' + paramValue + '"~';
      } else {
        query += paramValue + '~';
      }
    }
    return query;
  }

}(fs));