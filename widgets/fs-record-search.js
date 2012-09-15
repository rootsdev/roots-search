(function(utils, undefined){
  
  var hasFamilyTable = $('.result-data .household-label').length > 0;
  
  $(document).ready(function(){
    setup();
  });
  
  function setup() {
    
    // Process the table rows of the record data
    // The first cell in each row becomes the key
    // The second cell becomes a list of the cells in that row
    // We store all the cells because the gender of
    // family members on census records is important
    var recordData = {};
    $('.result-data tr').each(function(){
      var row = $(this);
      var fieldName = $.trim( $('td:first', row).text().toLowerCase().slice(0, -1) );
      if( fieldName ) {
        recordData[fieldName] = $('td', row);
      }
    });
    
    var nameParts = ['',''];
    if( recordData['first name'] ) {
      nameParts = [ getCleanCellValue( recordData['first name'], 1 ) , getCleanCellValue( recordData['last name'], 1 ) ];
    } 
    else if(recordData['name']) {
      nameParts = utils.splitName( getCleanCellValue( recordData['name'], 1 ) );
    }
    
    var personData = {
      'givenName': nameParts[0],
      'familyName': nameParts[1],
      'birthDate': checkMultipleFields( recordData, ['birth date', 'birthdate', 'estimated birth year', 'estimated birth date', 'baptism/christening date'], 1 ),
      'birthPlace': checkMultipleFields( recordData, ['birthplace', 'place of birth'], 1 ),
      'deathDate': getCleanCellValue( recordData['death date'], 1 ),
      'deathPlace': getCleanCellValue( recordData['death place'], 1 )
    };
    
    // Look for a spouse
    var spouseName = getSpousesName(recordData);
    if( spouseName ) {
      var spouseNameParts = utils.splitName( spouseName );
      personData['spouseGivenName'] = spouseNameParts[0];
      personData['spouseFamilyName'] = spouseNameParts[1];
    }
    
    // Look for a mother
    var motherName = getParentName(recordData, 'mother');
    if( motherName ) {
      var motherNameParts = utils.splitName( motherName );
      personData['motherGivenName'] = motherNameParts[0];
      personData['motherFamilyName'] = motherNameParts[1];
    }

    // Look for a father
    var fatherName = getParentName(recordData, 'father');
    if( fatherName ) {
      var fatherNameParts = utils.splitName( fatherName );
      personData['fatherGivenName'] = fatherNameParts[0];
      personData['fatherFamilyName'] = motherNameParts[1];
    }
    
    chrome.extension.sendRequest({
      'type': 'person_info',
      'data': personData
    });

  }
  
  // Check for the existence of multiple fields
  // First one found is returned
  function checkMultipleFields( recordData, fields, position ) {
    for( var i in fields ) {
      if( recordData[fields[i]] ) {
        var val = getCleanCellValue( recordData[fields[i]], position );
        if( val ) {
          return val;
        }
      }
    }
    return undefined;
  }
  
  function getCleanCellValue( cells, position ) {
    if( cells ) {
      return $.trim( cells.eq(position).text() );
    }
    return undefined;
  }
  
  function getRelationship(recordData) {
    return checkMultipleFields( recordData, ["relationship to head of household", "relationship to head of household (standardized)"], 1 ).toLowerCase();
  }
  
  function getSpousesName(recordData) {
    // Check to see if the "spouse's name" is set
    if( recordData["spouse's name"] ) {
      return getCleanCellValue( recordData["spouse's name"], 1 );
    }
    
    // If "spouse's name" isn't set do some crazy relationship jiu-jitsu
    else if( hasFamilyTable ) {
      var relationship = getRelationship(recordData);
      
      // The husband is always listed as the head of household
      // so we only look for the wife. If the wife is the head
      // of household it means the husband isn't there so returning
      // the wife will be undefined which means there is no spouse
      if( relationship == "head" || relationship == "self" ) {
        return getCleanCellValue( recordData['wife'], 1 );
      } else if( relationship == "wife" ) {
        return checkMultipleFields( recordData, ['head', 'self'], 1 );
      }
    }
    
    return undefined;
  }

  function getParentName(recordData, parent) {
    // Check to see if the "parent's name" is set
    if( recordData[parent+"'s name"] ) {
      return getCleanCellValue( recordData[parent+"'s name"], 1);
    }
    
    // If "parent's name" isn't set do some crazy relationship jiu-jitsu
    else if( hasFamilyTable ) {
      var relationship = getRelationship(recordData);
      
      if( relationship == 'son' || relationship == 'daughter' ) {
        var headGender = checkMultipleFields( recordData, ['head', 'self'], 2 );
        
        if( parent == 'father' ) {
          
          // Check to see if the gender of the head of household is male
          if( headGender == 'M' ) {
            return checkMultipleFields( recordData, ['head', 'self'], 1 );
          }
        } else if( parent == 'mother' ) {
          
          // If the head of household is male, return the wife's name
          // If the head of household is female, return the head's name
          if( headGender == 'F' ) {
            return checkMultipleFields( recordData, ['head', 'self'], 1 );
          } else if( headGender == 'M' ) {
            return getCleanCellValue( recordData['wife'], 1);
          }
        }
      }
    }
    
    return undefined;
  }

}(utils));