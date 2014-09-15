;(function(win, Projs, undefined){
	
  var Ajax = function(options){
    var success = null;
    var promise = {
      success: function(func){
        success = func;
        return this;
      },
      error: function(){

      }
    };
    var defaults = {
      method: 'GET',
      success: Projs.noop,
      error: Projs.noop
    };
    options = Projs.extend(defaults, options);
    var xmlHttpRequest = Ajax.createXMLHttpRequest();
    xmlHttpRequest.onreadystatechange = function(){
      console.log('onreadystatechange');
    }
   if(options.method == 'post') {
      xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    if(xmlHttpRequest.overrideMimeType && options.type == 'xml') {
      xmlHttpRequest.overrideMimeType('text/xml');
    }
    try{
      xmlHttpRequest.open(options.method, options.url, options.async);
      xmlHttpRequest.send(options.data);
    }catch(e){
      options.error(e);
    }
    setTimeout(promise.success, 1000);
    return promise;
  };

  Ajax.createXMLHttpRequest = function(){
    var request = new XMLHttpRequest();
    return request;
  };

  Ajax.get = function(url, callback){
    Ajax({
      url: url,
      method: 'GET',
      success: function(data){
        callback(null, data);
      },
      error: function(err){
        callback(err);
      }
    });
  };

  Ajax.post = function(url, data, callback){
    Ajax({
      url: url,
      method: 'POST',
      success: function(data){
        callback(null, data);
      },
      error: function(err){
        callback(err);
      }
    });

  };

  Ajax.put = function(url, data, callback){
    Ajax({
      url: url,
      method: 'PUT',
      success: function(data){
        callback(null, data);
      },
      error: function(err){
        callback(err);
      }
    });

  };

  Ajax.delete = function(url, callback){
    Ajax({
      url: url,
      method: 'DELETE',
      success: function(data){
        callback(null, data);
      },
      error: function(err){
        callback(err);
      }
    });

  };

  Projs.Ajax = Ajax;
})(window, Projs);