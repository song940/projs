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
    for(var key in obj){
      callback(key ,obj[key]);
    }
  };

  Projs.typeOf = function(obj){
    var type = Object.prototype.toString.call(obj);
    var regexp = /\[|object |\]/gm;
    return type.replace(regexp, ''); // || (typeof obj);
  };

  win['Projs'] = Projs;

})(window);
