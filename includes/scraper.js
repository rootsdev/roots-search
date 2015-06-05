chrome.extension.sendRequest({
  'type': 'visit',
  'data': window.location.href
});

genscrape()
  .on('data', function(data){
    console.log('data');
    chrome.extension.sendRequest({
      'type': 'person_info',
      'data': data
    });
  })
  .on('noData', function(){
    console.log('no data');
    chrome.extension.sendRequest({
      'type': 'hide'
    });
  })
  .on('noMatch', function(){
    console.log('no match');
  })
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