(function(fs){

  fs.registerSearchBuilder('familysearch', createUrl);

  function createUrl(summary, relationships) {
    var fsURL = 'https://familysearch.org/search/records/index#count=20&query=';
    
    var birthYear = fs.getYear(summary.data.birthConclusion.details.date.normalizedText);
    var gender = summary.data.gender;
    
    // Process summary info
    var query = '';
    query = addQueryParam(query, 'givenname', summary.data.nameConclusion.details.givenPart);
    query = addQueryParam(query, 'surname', summary.data.nameConclusion.details.familyPart);
    query = addQueryParam(query, 'birth_place', summary.data.birthConclusion.details.place.normalizedText);
    if(birthYear) {
      query = addQueryParam(query, 'birth_year', (birthYear-10)+'-'+(birthYear+10));
    }
    
    /**
     * The surnames of the parents and spouse are commented out because
     * they usually decrease the quality of results when included
     */
    
    // Process parents
    if(relationships.data.parents.length) {
      var fatherName = fs.processName(relationships.data.parents[0].husband.name);
      var motherName = fs.processName(relationships.data.parents[0].wife.name);
      query = addQueryParam(query,'father_givenname',fatherName[0]);
      //query = addQueryParam(query,'father_surname',fatherName[1]);
      query = addQueryParam(query,'mother_givenname',motherName[0]);
      //query = addQueryParam(query,'mother_surname',motherName[1]);
    }
    
    if(relationships.data.spouses.length) {
      // Process spouse
      var spouseName;
      if(gender == 'MALE' && relationships.data.spouses[0].wife) {
        spouseName = fs.processName(relationships.data.spouses[0].wife.name);
      } else if(gender == 'FEMALE' && relationships.data.spouses[0].husband) {
        spouseName = fs.processName(relationships.data.spouses[0].husband.name);
      }
      if(spouseName) {
        query = addQueryParam(query,'spouse_givenname',spouseName[0]);
        //query = addQueryParam(query,'spouse_surname',spouseName[1]);
      }
      
      // Process marriage info
      if(relationships.data.spouses[0].event) {
        var marriageYear = fs.getYear(relationships.data.spouses[0].event.standardDate);
        query = addQueryParam(query,'marriage_place',relationships.data.spouses[0].event.standardPlace);
        query = addQueryParam(query,'marriage_year',(marriageYear-10)+'-'+(marriageYear+10));
      }
    }
    
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

}(fsTreeSearch));