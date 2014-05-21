(function(utils, undefined){

  $(document).ready(function(){
    try {
      setup();
    } catch(e) {
      utils.reportError(e, window.location.href);
    }
  });

  function setup() {

    /* Open Archives uses schema.org/Person microdata, so scraping is easy ! */

    var givenName=$('div[itemtype="http://schema.org/Person"]:eq(0) meta[itemprop="givenName"]').attr("content");
    var familyName=$('div[itemtype="http://schema.org/Person"]:eq(0) meta[itemprop="familyName"]').attr("content");

    var birthPlace;
    var birthDate;

    var fatherGivenName;
    var fatherFamilyName;
    var motherGivenName;
    var motherFamilyName;
    var spouseGivenName;
    var spouseFamilyName;
    
    if (givenName) {
      birthPlace=$('div[itemtype="http://schema.org/Person"]:eq(0) span[itemprop="birth"] span[itemprop="location"] meta[itemprop="name"]').attr("content");
      birthDate=$('div[itemtype="http://schema.org/Person"]:eq(0) span[itemprop="birth"] meta[itemprop="startDate"]').attr("content");
      spouseGivenName=$('div[itemtype="http://schema.org/Person"]:eq(1) meta[itemprop="givenName"]').attr("content");
      spouseFamilyName=$('div[itemtype="http://schema.org/Person"]:eq(1) meta[itemprop="familyName"]').attr("content");

      if (!spouseGivenName) {
        var fathid=0;
        var mothid=1;
        if ($('p[itemprop="parent"]:eq(0) meta[itemprop="gender"]').attr("content")=="female") {
          fathid=1;
          mothid=0;
        }
        fatherGivenName=$('p[itemprop="parent"]:eq('+fathid+') meta[itemprop="givenName"]').attr("content");
        fatherFamilyName=$('p[itemprop="parent"]:eq('+fathid+') meta[itemprop="familyName"]').attr("content");
        motherGivenName=$('p[itemprop="parent"]:eq('+mothid+') meta[itemprop="givenName"]').attr("content");
        motherFamilyName=$('p[itemprop="parent"]:eq('+mothid+') meta[itemprop="familyName"]').attr("content");
      }
    } else {
      givenName=$('li[itemtype="http://schema.org/Person"]:eq(0) meta[itemprop="givenName"]').attr("content");
      familyName=$('li[itemtype="http://schema.org/Person"]:eq(0) meta[itemprop="familyName"]').attr("content");
      birthPlace=$('li[itemtype="http://schema.org/Person"]:eq(0) span[itemprop="birth"] span[itemprop="location"] meta[itemprop="name"]').attr("content");
      birthDate=$('li[itemtype="http://schema.org/Person"]:eq(0) span[itemprop="birth"] meta[itemprop="startDate"]').attr("content");
    }

    if (givenName) {
      var personData= {
        'givenName': givenName,
        'familyName': familyName,
        'birthPlace': birthPlace,
        'birthDate': birthDate,
        'spouseGivenName': spouseGivenName,
        'spouseFamilyName': spouseFamilyName,
        'fatherGivenName': fatherGivenName,
        'fatherFamilyName': fatherFamilyName,
        'motherGivenName': motherGivenName,
        'motherFamilyName': motherFamilyName
      };

      chrome.extension.sendRequest({
        'type': 'person_info',
        'data': personData
      });
    }
  }
  
}(utils));