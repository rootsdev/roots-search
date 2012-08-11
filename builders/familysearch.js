(function(fs){

  fs.registerLinkBuilder('familysearch', createUrl);

  function createUrl(pd) {
    var fsURL = 'https://familysearch.org/search/records/index#count=20&query=';
    var query = '';
    
    // Process summary info
    var birthYear = fs.getYear(pd.birthDate);
    query = addQueryParam(query, 'givenname', pd.givenName);
    query = addQueryParam(query, 'surname', pd.familyName);
    query = addQueryParam(query, 'birth_place', pd.birthPlace);
    if( birthYear ) {
      query = addQueryParam(query, 'birth_year', (birthYear-10)+'-'+(birthYear+10));
    }
    
    /**
     * The surnames of the parents and spouse are commented out because
     * they usually decrease the quality of results when included
     */
    
    // Process parents
    query = addQueryParam(query, 'father_givenname', pd.fatherGivenName);
    //query = addQueryParam(query, 'father_surname', pd.fatherFamilyName);
    query = addQueryParam(query, 'mother_givenname', pd.motherGivenName);
    //query = addQueryParam(query, 'mother_surname', pd.motherFamilyName);    

    query = addQueryParam(query, 'spouse_givenname',pd.spouseGivenName);
    //query = addQueryParam(query, 'spouse_surname',pd.spouseFamilyName);

    var marriageYear = fs.getYear(pd.marriageDate);
    if( marriageYear ) {
      query = addQueryParam(query, 'marriage_year', (marriageYear-10)+'-'+(marriageYear+10));
    }
    query = addQueryParam(query, 'marriage_place', pd.marriagePlace);

    // Update link
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