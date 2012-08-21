(function(rs, undefined){
  
  var hasFamilyTable = $('.result-data .household-label').length > 0;
  
  $(document).ready(function(){
    setup();
  });
  
  function setup() {
    
    /**
     * First we setup the widget container. Choose carefully where to
     * put the search links. The widget should use the site's style
     * and be in a non-intrusive but useful location.
     */
     
    var searchTrigger = $('<li class="rs-search-tool"><a href="#">SEARCH</a></li>').appendTo( $('.global-toolbar .toolset') );
    var flyout = $('<nav class="flyout share-flyout"><div class="flyout-direction"><div></div></div></nav>').appendTo(searchTrigger);
    var linksList = $('<ul>').prependTo(flyout);
    
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
    
    var nameParts = rs.splitName( getCleanCellValue( recordData['name'], 1 ) );
    
    var personData = {
      'givenName': nameParts[0],
      'familyName': nameParts[1],
      'birthDate': checkMultipleFields( recordData, ['birth date', 'birthdate', 'estimated birth year', 'estimated birth date'] ),
      'birthPlace': checkMultipleFields( recordData, ['birthplace', 'place of birth'] ),
      'deathDate': getCleanCellValue( recordData['death date'], 1 ),
      'deathPlace': getCleanCellValue( recordData['death place'], 1 )
    };
    
    // Look for a spouse
    var spouseName = getSpousesName(recordData);
    if( spouseName ) {
      var spouseNameParts = rs.splitName( spouseName );
      personData['spouseGivenName'] = spouseNameParts[0];
      personData['spouseFamilyName'] = spouseNameParts[1];
    }
    
    // Look for a mother
    var motherName = getParentName(recordData, 'mother');
    if( motherName ) {
      var motherNameParts = rs.splitName( motherName );
      personData['motherGivenName'] = motherNameParts[0];
      personData['motherFamilyName'] = motherNameParts[1];
    }

    // Look for a father
    var fatherName = getParentName(recordData, 'father');
    if( fatherName ) {
      var fatherNameParts = rs.splitName( fatherName );
      personData['fatherGivenName'] = fatherNameParts[0];
      personData['fatherFamilyName'] = motherNameParts[1];
    }
    
    var linkData = rs.executeLinkBuilders(personData);
     
    $.each(linkData, function(i, link) {
      linksList.append( '<li><a href="'+link.url+'" target="_blank">'+link.text.toUpperCase()+'</a></li>' );
    });

  }
  
  // Check for the existence of multiple fields
  // First one found is returned
  function checkMultipleFields( recordData, fields ) {
    for( var i in fields ) {
      if( recordData[fields[i]] ) {
        return getCleanCellValue( recordData[fields[i]], 1 );
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
    return checkMultipleFields( recordData, ["relationship to head of household", "relationship to head of household (standardized)"]).toLowerCase();
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
      if( relationship == "head" ) {
        return getCleanCellValue( recordData['wife'], 1);
      } else if( relationship == "wife" ) {
        return getCleanCellValue( recordData['head'], 1);
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
        var headGender = getCleanCellValue( recordData['head'], 2);
        
        if( parent == 'father' ) {
          
          // Check to see if the gender of the head of household is male
          if( headGender == 'M' ) {
            return getCleanCellValue( recordData['head'], 1);
          }
        } else if( parent == 'mother' ) {
          
          // If the head of household is male, return the wife's name
          // If the head of household is female, return the head's name
          if( headGender == 'F' ) {
            return getCleanCellValue( recordData['head'], 1);
          } else if( headGender == 'M' ) {
            return getCleanCellValue( recordData['wife'], 1);
          }
        }
      }
    }
    
    return undefined;
  }

}(rs));