;(function(win, undefined){
 "use strict";

  /**
   * [Projs description]
   * @param {[type]} selector [description]
   * @param {[type]} context  [description]
   */
  var Projs = function(selector, context){
    var type = Projs.typeOf(selector);
    switch(type){
      case 'Array':
        var arr = selector;
        return new Projs.Array(arr);
        break;
      case 'Object':
        var obj = selector;
        return new Projs.Object(obj);
        break;
      default: 
        if(Projs.DOM){
          return Projs.DOM(selector, context);
        }else{
          console.error('Projs have not DOM selector .');
        }
        break;
    }
  };

  Projs.version = [0, 0, 0];

  Projs.noop = function(){};

  /**
   * [extend description]
   * @param  {[type]} destination [description]
   * @param  {[type]} source      [description]
   * @return {[type]}             [description]
   */
  Projs.extend = function(destination, source){
    for(var key in source){
      destination[key] = source[key];
    }
    return destination;
  };

  Projs.each = function(obj, callback){
    var type = Projs.typeOf(obj);
    switch(type){
      case 'Array':
      case 'NodeList':
        for(var i=0;i<obj.length;i++){
          callback(i, obj[i]);
        }
        break;
      case 'Object':
      default:
        for(var key in obj){
          callback(key, obj[key]);
        }
        break;
    }
  };

  Projs.typeOf = function(obj){
    var type = Object.prototype.toString.call(obj);
    var regexp = /\[|object |\]/gm;
    return type.replace(regexp, ''); // || (typeof obj);
  };

  Projs.toArray = function(list){
    return Array.prototype.slice.call(list);
  };

  Projs.uniq = function(arr){
    return arr.reduce(function(p, c){
      if(p.indexOf(c) < 0) p.push(c);
      return p;
    }, []);
  };

  win['Projs'] = Projs;

})(window);

;(function(win, Projs, undefined){

  var modules = {};

  var require = function(deps, callback){
    if(Projs.typeOf(deps) !== 'Array' ){
      callback = deps;
      deps = [];
    }
    var params = [];
    var currentScript = document.currentScript;

    var finish  = function(){
      var exports = callback.apply(callback, params);
      var moduleName = currentScript.id || 'REQUIRE_MAIN';

      var module = modules[ moduleName ] || {
        name: moduleName,
        onload: []
      };
      module.exports = exports;
      module.status = 'loaded';
      Projs.each(module.onload, function(index, handler) {
        handler(exports);
      });
      module.onload = [];
    };
    Projs.each(deps, function(index, dep) {
      var module = modules[ dep ] = (modules[ dep ] || {
        name: dep,
        onload: [],
        status: 'loading'
      });
      module.onload.push(function(exports){
        params.push(exports);
        if(params.length == deps.length){
          finish(params);
        }
      });
      loadMod(dep);
    });
    if(!deps.length){
      finish();
    }
    
  };

  require.config = {
    baseUrl: '/js',
    paths: {
      app: '../demo/js'
    }
  };


  var loadMod = function(name){
    var module = modules[name];
    if(module && module.status == 'loaded'){
      Projs.each(module.onload, function(handler){
        handler(module.exports);
      });
      return;
    };
    var url = getModUrl(name);
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    script.id = name; 
    script.src = url;
    script.onerror = function(){
      console.error('module load error .');
    };

    var currentScript = document.currentScript;
    var head = currentScript.parentNode;
    head.insertBefore(script);
  };

  var getModUrl = function(name){
    var url = [require.config.baseUrl, name].join('/');

    for(var key in require.config.paths){
      var path = require.config.paths[key];
      url = url.replace(key, path)
    }

    url = url.replace(/\/+/, '/');
    if(!/.js$/.test(url)){
      url += '.js';
    }
    return url;
  };

  Projs.define = require;
  Projs.require = require;


})(window, Projs || {});