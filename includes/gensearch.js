!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.gensearch=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var utils = _dereq_('./utils.js'),
    config = {};

var sites = {
  'ancestry': _dereq_('./sites/ancestry.js'),
  'archives': _dereq_('./sites/archives.js'),
  'billiongraves': _dereq_('./sites/billiongraves.js'),
  'familysearch': _dereq_('./sites/familysearch.js'),
  'findagrave': _dereq_('./sites/findagrave.js'),
  'findmypast': _dereq_('./sites/findmypast.js'),
  'fold3': _dereq_('./sites/fold3.js'),
  'genealogieonline': _dereq_('./sites/genealogieonline.js'),
  'genealogybank': _dereq_('./sites/genealogybank.js'),
  'geni': _dereq_('./sites/geni.js'),
  'newspapers': _dereq_('./sites/newspapers.js'),
  'openarchives': _dereq_('./sites/openarchives.js'),
  'werelate': _dereq_('./sites/werelate.js'),
  'worldvitalrecords': _dereq_('./sites/worldvitalrecords.js')
};

// Main search link generation function
var search = module.exports = function(site, person, opts){
  if(sites[site]){
    return sites[site](utils.extend({}, config[site], opts), person);
  }
};

/**
 * Set global config for a site. May be used in two ways:
 * config('site', {options});
 * config({'site': options});
 */
search.config = function(site, siteConfig){
  // config('site', {options});
  if(utils.isString(site) && utils.isObject(siteConfig)){
    config[site] = utils.extend({}, config[site], siteConfig);
  } 
  
  // config({site: options});
  else if(site && utils.isUndefined(siteConfig)) {
    var newConfig = site;
    utils.each(newConfig, function(siteConfig, site){
      config[site] = utils.extend({}, config[site], siteConfig);
    });
  } 
  
  // config()
  else {
    return config;
  }
};

},{"./sites/ancestry.js":2,"./sites/archives.js":3,"./sites/billiongraves.js":4,"./sites/familysearch.js":5,"./sites/findagrave.js":6,"./sites/findmypast.js":7,"./sites/fold3.js":8,"./sites/genealogieonline.js":9,"./sites/genealogybank.js":10,"./sites/geni.js":11,"./sites/newspapers.js":12,"./sites/openarchives.js":13,"./sites/werelate.js":14,"./sites/worldvitalrecords.js":15,"./utils.js":16}],2:[function(_dereq_,module,exports){
var utils = _dereq_('../utils.js');

module.exports = function(config, data){

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
    ['mssns0', 'spouseFamilyName'],
    ['msgpn__ftp', 'marriagePlace']
  ]; 
  
  utils.each(mappings, function(map) {
    if( data[map[1]] ) {
      query = utils.addQueryParam(query, map[0], data[map[1]]);
    }
  });
  
  // Process dates
  query = utils.addQueryParam(query, 'msbdy', utils.getYear(data.birthDate));
  query = utils.addQueryParam(query, 'msddy', utils.getYear(data.deathDate));
  query = utils.addQueryParam(query, 'msgdy', utils.getYear(data.marriageDate));
  
  if(config.db){
    query = utils.addQueryParam(query, 'db', config.db);
  } else {
    query = utils.addQueryParam(query, 'gl', 'allgs');
  }
  
  return ancestryURL + query;

};

},{"../utils.js":16}],3:[function(_dereq_,module,exports){
var utils = _dereq_('../utils.js');

var defaultConfig = {
  birthRange: 2,
  deathRange: 2
};

module.exports = function(config, data){

  config = utils.defaults(config, defaultConfig);

  var url = 'http://www.archives.com/GA.aspx';    
  var query = '?_act=registerAS_org&Location=US';

  if(data.givenName) {
    query = utils.addQueryParam(query, 'FirstName', data.givenName);
  }
  if(data.familyName) {
    query = utils.addQueryParam(query, 'LastName', data.familyName);
  }
  if(data.birthDate) {
    query = utils.addQueryParam(query, 'BirthYear', utils.getYear(data.birthDate));
    query = utils.addQueryParam(query, 'BirthYearSpan', config.birthRange);
  }
  if(data.deathDate) {
    query = utils.addQueryParam(query, 'DeathYear', utils.getYear(data.deathDate));
    query = utils.addQueryParam(query, 'DeathYearSpan', config.deathRange);
  }

  return url + query;

};

},{"../utils.js":16}],4:[function(_dereq_,module,exports){
var utils = _dereq_('../utils.js');

var defaultConfig = {
  yearRange: 2
};

module.exports = function(config, data){

  config = utils.defaults(config, defaultConfig);

  var url = 'http://billiongraves.com/pages/search/index.php#year_range=' + config.yearRange + '&lim=0&action=search&exact=false&country=0&state=0&county=0';
  var query = '';
  
  if(data.givenName) {
    query = utils.addQueryParam(query, 'given_names', data.givenName);
  }
  if(data.familyName) {
    query = utils.addQueryParam(query, 'family_names', data.familyName);
  }
  
  if(data.birthDate) {
    query = utils.addQueryParam(query, 'birth_year', utils.getYear(data.birthDate));
  }
  
  if(data.deathDate) {
    query = utils.addQueryParam(query, 'death_year', utils.getYear(data.deathDate));
  }
  
  return url + query;

};

},{"../utils.js":16}],5:[function(_dereq_,module,exports){
var utils = _dereq_('../utils.js');
    
var defaultConfig = {
  birthRange: 2,
  deathRange: 2,
  marriageRange: 2
};

module.exports = function(config, data){

  config = utils.defaults(config, defaultConfig);

  var fsURL = 'https://familysearch.org/search/record/results#count=20&query=';
  var query = '';
  
  // Simple mappings from the person data object to fs params
  // These don't need any special processing
  var simpleMappings = [
    ['givenname', 'givenName'],
    ['surname', 'familyName'],
    ['birth_place', 'birthPlace'],
    ['death_place', 'deathPlace'],
    ['father_givenname', 'fatherGivenName'],
    ['father_surname', 'fatherFamilyName'],
    ['mother_givenname', 'motherGivenName'],
    ['mother_surname', 'motherFamilyName'],
    ['spouse_givenname', 'spouseGivenName'],
    ['spouse_surname', 'spouseFamilyName'],
    ['marriage_place', 'marriagePlace']
  ];
  utils.each(simpleMappings, function(map) {
    if( data[map[1]] ) {
      query = addQueryParam(query, map[0], data[map[1]]);
    }
  });
  
  // Process the birth year 
  if(data.birthDate){
    var birthYear = utils.getYearInt(data.birthDate);
    if( birthYear ) {
      query = addQueryParam(query, 'birth_year', (birthYear - config.birthRange)+'-'+(birthYear + config.birthRange));
    }
  }
  
  // Process the death year
  if(data.deathDate){
    var deathYear = utils.getYearInt(data.deathDate);
    if( deathYear ) {
      query = addQueryParam(query, 'death_year', (deathYear - config.deathRange)+'-'+(deathYear + config.deathRange));
    }
  }

  // Process the marriage year
  if(data.marriageDate){
    var marriageYear = utils.getYearInt(data.marriageDate);
    if( marriageYear ) {
      query = addQueryParam(query, 'marriage_year', (marriageYear - config.marriageRange)+'-'+(marriageYear + config.marriageRange));
    }
  }
  
  query = encodeURIComponent(query);
  
  if(config.collectionId){
    query = utils.addQueryParam(query, 'collection_id', config.collectionId);
  }
  
  return fsURL + query;

};

/**
 * Add a query parameter to the current query
 */
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
};
},{"../utils.js":16}],6:[function(_dereq_,module,exports){
var utils = _dereq_('../utils.js');

module.exports = function(config, data){

  var url = 'http://www.findagrave.com/cgi-bin/fg.cgi?page=gsr&GScntry=0&GSst=0&GSgrid=&df=all&GSob=n';
  var query = '';
  
  if( data.givenName ) {
    query = utils.addQueryParam(query, 'GSfn', data.givenName);
  }
  if( data.familyName ) {
    query = utils.addQueryParam(query, 'GSln', data.familyName);
  }
  
  if( data.birthDate ) {
    query = utils.addQueryParam(query, 'GSbyrel', 'in');
    query = utils.addQueryParam(query, 'GSby', (new Date(data.birthDate)).getFullYear());
  }
  
  if( data.deathDate ) {
    query = utils.addQueryParam(query, 'GSdyrel', 'in');
    query = utils.addQueryParam(query, 'GSdy', (new Date(data.deathDate)).getFullYear());
  }
  
  return url + query;

};

},{"../utils.js":16}],7:[function(_dereq_,module,exports){
var utils = _dereq_('../utils.js');

var defaultConfig = {
  birthRange: 2,
  deathRange: 2,
  otherRange: 2
};

module.exports = function(config, data){

  config = utils.defaults(config, defaultConfig);

  // TODO
  // * allow for .com or other fmp sites
  // * allow for record category
  // * restrict to record set(s)?
  
  var baseUrl = 'http://search.findmypast.co.uk/search/world-records?firstname_variants=true';
  var query = '';
  
  // Name
  if(data.givenName) {
    query = utils.addQueryParam(query, 'firstname', data.givenName);
  }
  if(data.familyName) {
    query = utils.addQueryParam(query, 'lastname', data.familyName);
  }
  
  // Birth
  if(config.event === 'birth'){
    
    if(data.birthDate){
      query = utils.addQueryParam(query, 'yearofbirth', utils.getYear(data.birthDate));
    }
    
    if(data.birthPlace){
      query = utils.addQueryParam(query, 'keywordsplace', data.birthPlace);
    }
    
    query = utils.addQueryParam(query, 'yearofbirth_offset', config.birthRange);
  }
  
  // Death
  else if(config.event === 'death'){
    
    if(data.deathDate){
      query = utils.addQueryParam(query, 'yearofdeath', utils.getYear(data.deathDate));
    }
    
    if(data.deathPlace){
      query = utils.addQueryParam(query, 'keywordsplace', data.deathPlace);
    }
    
    query = utils.addQueryParam(query, 'yearofdeath_offset', config.deathRange);
  }
  
  // Other event
  else if(config.event === 'other'){
  
    if(config.otherDate){
      query = utils.addQueryParam(query, 'eventyear', utils.getYear(config.otherDate));
    }
    
    if(config.otherPlace){
      query = utils.addQueryParam(query, 'keywordsplace', config.otherPlace);
    }
    
    query = utils.addQueryParam(query, 'eventyear_offset', config.otherRange);
  
  }
  
  return baseUrl + query;
  
};
},{"../utils.js":16}],8:[function(_dereq_,module,exports){
var utils = _dereq_('../utils.js');

module.exports = function(config, data){

  var url = 'http://go.fold3.com/query.php?query=';
  var query = '';
  
  if(data.givenName) {
    query += data.givenName;
  }
  
  if(data.familyName) {
    if(query) {
      query += ' ';
    }
    query += data.familyName;
  }
  
  // Replace spaces with +
  query = query.replace(/ /g, '+');
  
  return url + query;
  
};

},{"../utils.js":16}],9:[function(_dereq_,module,exports){
var utils = _dereq_('../utils.js');

var defaultConfig = {
  birthRange: 5,
  deathRange: 5
};

module.exports = function(config, data){

  config = utils.defaults(config, defaultConfig);

  var url = 'http://www.genealogieonline.nl/en/zoeken/?publication=0';	// defaults to English version of website    
  var query = '';

  if(data.givenName) {
    query = utils.addQueryParam(query, 'q', data.familyName);
  }

  if(data.familyName) {
    query = utils.addQueryParam(query, 'vn', data.givenName);
  }

  if(data.spouseFamilyName) {
    query = utils.addQueryParam(query, 'pa', data.spouseFamilyName);
  }

  var place='';
  if (data.birthPlace) {
  	place=data.birthPlace;
  } else {
  	if (data.deathPlace) {
  		place=data.deathPlace;
  	} else {
  		if (data.marriagePlace) {
  			place=data.marriagePlace;
  		}
  	}
  }
  if (place) {
    query = utils.addQueryParam(query, 'pn', place);
  }
  
  if(data.birthDate) {
    query = utils.addQueryParam(query, 'gv', utils.getYear(data.birthDate)*1-config.birthRange);
    query = utils.addQueryParam(query, 'gt', utils.getYear(data.birthDate)*1+config.birthRange);
  }

  if(data.deathDate) {
    query = utils.addQueryParam(query, 'ov', utils.getYear(data.deathDate)*1-config.deathRange);
    query = utils.addQueryParam(query, 'ot', utils.getYear(data.deathDate)*1+config.deathRange);
  }

  return url + query;

};

},{"../utils.js":16}],10:[function(_dereq_,module,exports){
var utils = _dereq_('../utils.js');

var defaultConfig = {
  lifespan: 90,
  datePadding: 5
};

module.exports = function(config, data){

  config = utils.defaults(config, defaultConfig);

  var baseUrl = 'http://www.genealogybank.com/gbnk/?dateType=range';
  var query = '';
  
  // Name
  query = utils.addQueryParam(query, 'fname', data.givenName);
  query = utils.addQueryParam(query, 'lname', data.familyName);
  
  //
  // Year range
  //
  
  var birthYear = utils.getYearInt(data.birthDate), 
      deathYear = utils.getYearInt(data.deathDate);
  
  // We have a birth date
  if(birthYear) {
    
    // We also have death date so add padding
    if(deathYear){
      deathYear += config.datePadding;
    } 
    
    // We have a birth date but not a death date, so add
    // the lifespan value to the birth year
    else {
      deathYear = birthYear + config.lifespan;
    }
    
    // Pad the birth year
    birthYear -= config.datePadding
  } 
  
  // We have a death year but not a birth year
  else if(deathYear) {
    
    // Subtract lifespan value from deathYear
    birthYear = deathYear - config.lifespan;
    
    // Pad the death year
    deathYear += config.datePadding;
  }
  
  if(birthYear && deathYear){
    query = utils.addQueryParam(query, 'rgfromDate', birthYear);
    query = utils.addQueryParam(query, 'rgtoDate', deathYear);
  }
  
  return baseUrl + query;

};

},{"../utils.js":16}],11:[function(_dereq_,module,exports){
var utils = _dereq_('../utils.js');

module.exports = function(config, data){

  var url = 'http://www.geni.com/search?search_type=people&names=';
  var name = '';
  
  if( data.givenName ) {
    name += data.givenName;
  }
  
  if( data.familyName ) {
    if( name ) {
      name += ' ';
    }
    name += data.familyName;
  }
  
  // Replace spaces with +
  name = name.replace(/ /g, '+');
  
  return url + name;
  
};

},{"../utils.js":16}],12:[function(_dereq_,module,exports){
var utils = _dereq_('../utils.js');

var defaultConfig = {
  lifespan: 90,
  datePadding: 5
};

module.exports = function(config, data){

  config = utils.defaults(config, defaultConfig);

  var baseUrl = 'http://go.newspapers.com/results.php?query=';
  var query = '';
  
  // Name
  if(data.givenName) {
    query += data.givenName;
  }
  if(data.familyName) {
    if(query) {
      query += ' ';
    }
    query += data.familyName;
  }
  
  //
  // Year range
  //
  
  var birthYear = utils.getYearInt(data.birthDate), 
      deathYear = utils.getYearInt(data.deathDate);
  
  // We have a birth date
  if(birthYear) {
    
    // We also have death date so add padding
    if(deathYear){
      deathYear += config.datePadding;
    } 
    
    // We have a birth date but not a death date, so add
    // the lifespan value to the birth year
    else {
      deathYear = birthYear + config.lifespan;
    }
    
    // Pad the birth year
    birthYear -= config.datePadding
  } 
  
  // We have a death year but not a birth year
  else if(deathYear) {
    
    // Subtract lifespan value from deathYear
    birthYear = deathYear - config.lifespan;
    
    // Pad the death year
    deathYear += config.datePadding;
  }
  
  if(birthYear && deathYear){
    query = utils.addQueryParam(query, 'year-start', birthYear);
    query = utils.addQueryParam(query, 'year-end', deathYear);
  }
  
  return baseUrl + query;

};

},{"../utils.js":16}],13:[function(_dereq_,module,exports){
var utils = _dereq_('../utils.js');

module.exports = function(config, data){

  var url = 'http://www.openarch.nl/search.php?lang=en&name='; // defaults to English version of website  
  var query = '';
  
  if(data.givenName) {
    query += data.givenName;
  }
  
  if(data.familyName) {
    if(query) {
      query += ' ';
    }
    query += data.familyName;
  }
  
  // Replace spaces with +
  query = query.replace(/ /g, '+');
  
  return url + query;

};
},{"../utils.js":16}],14:[function(_dereq_,module,exports){
var utils = _dereq_('../utils.js');

var defaultConfig = {
  birthRange: 2,
  deathRange: 2
};

module.exports = function(config, data){

  config = utils.defaults(config, defaultConfig);

  var baseUrl = 'http://www.werelate.org/wiki/Special:Search?sort=score&ns=Person&rows=20&ecp=p';
  var query = '';
  
  // Simple mappings from the person data object to params
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
  utils.each(mappings, function(map) {
    if(data[map[1]]) {
      query = utils.addQueryParam(query, map[0], data[map[1]]);
    }
  });
  
  // Process dates and add the ranges
  if(data.birthDate) {
    query = utils.addQueryParam(query, 'bd', utils.getYear(data.birthDate));
    query = utils.addQueryParam(query, 'br', config.birthRange);
  }
  if(data.deathDate) {
    query = utils.addQueryParam(query, 'dd', utils.getYear(data.deathDate));
    query = utils.addQueryParam(query, 'dr', config.deathRange);
  }
  
  return baseUrl + query;

};

},{"../utils.js":16}],15:[function(_dereq_,module,exports){
var utils = _dereq_('../utils.js');

var defaultConfig = {
  dateRange: 2
};

module.exports = function(config, data){

  config = utils.defaults(config, defaultConfig);

  var baseUrl = 'http://www.worldvitalrecords.com/GlobalSearch.aspx?qt=g';
  var query = '';
  
  // Name
  query = utils.addQueryParam(query, 'zfn', data.givenName);
  query = utils.addQueryParam(query, 'zln', data.familyName);
  
  // Place
  if(data.birthPlace){
    query = utils.addQueryParam(query, 'zplace', data.birthPlace);
  } else if(data.deathPlace){
    query = utils.addQueryParam(query, 'zplace', data.deathPlace);
  }
  
  // Date
  if(data.birthDate) {
    query = utils.addQueryParam(query, 'zdate', utils.getYear(data.birthDate));
    query = utils.addQueryParam(query, 'zdater', config.dateRange);
  } else if(data.deathDate) {
    query = utils.addQueryParam(query, 'zdate', utils.getYear(data.deathDate));
    query = utils.addQueryParam(query, 'zdater', config.dateRange);
  }
  
  // TODO record type?
  
  return baseUrl + query;

};

},{"../utils.js":16}],16:[function(_dereq_,module,exports){
var utils = {};

/**
 * Extract the year from a date.
 * Capture the special case of just a year because
 * javascript will consider it as the first second
 * of that year in GMT then convert it to the current
 * timezone which could be the previous year.
 */
utils.getYear = function(date){
  return /^\d{4}$/.test(date) ? date : new Date(date).getFullYear();
};

/**
 * Extract the year from a date and return as an integer.
 */
utils.getYearInt = function(date){
  return parseInt(utils.getYear(date));
};

/**
 * Add a query param to a url
 */
utils.addQueryParam = function(query, name, value){
  if(value){
    query += '&' + name + '=' + encodeURIComponent(value);
  }
  return query;
};

/**
 * Functions lifted from underscore.js
 * http://underscorejs.org/
 */
 
utils.isObject = function(obj) {
  return obj === Object(obj);
};

utils.isString = function(obj){
  return toString.call(obj) == '[object String]';
};

utils.isUndefined = function(obj){
  return obj === void 0;
};
 
utils.each = function(obj, iterator, context) {
  if (obj == null) return obj;
  if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, length = obj.length; i < length; i++) {
      iterator.call(context, obj[i], i, obj);
    }
  } else {
    var keys = utils.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      iterator.call(context, obj[keys[i]], keys[i], obj);
    }
  }
  return obj;
};

utils.keys = function(obj) {
  if (!utils.isObject(obj)) return [];
  if (Object.keys) return Object.keys(obj);
  var keys = [];
  for (var key in obj) if (hasOwnProperty.call(obj, key)) keys.push(key);
  return keys;
};
 
utils.defaults = function(obj) {
  utils.each(Array.prototype.slice.call(arguments, 1), function(source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

utils.extend = function(obj) {
  utils.each(Array.prototype.slice.call(arguments, 1), function(source) {
    if (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

module.exports = utils;

},{}]},{},[1])
(1)
});