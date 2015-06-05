genscrape()
  .on('data', function(data){
    chrome.extension.sendRequest({
      'type': 'person_info',
      'data': data
    });
  })
  .on('noData', function(){
    chrome.extension.sendRequest({
      'type': 'hide'
    });
  })
  /*
  // TODO: logging
  .on('noMatch', function(){
    
  })
  */
  .on('error', function(e){
    chrome.extension.sendRequest({
      'type': 'js_error',
      'data': {
        'title': exception.name,
        'message': exception.message + "\n\n" + exception.stack,
        'url': url
      }
    });
  });