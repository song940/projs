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

  Projs.noop = function(){

  };

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


  /**
   * [DOM description]
   * @param {[type]} selector [description]
   * @param {[type]} context  [description]
   */
  var DOM = function(selector, context){
    return new DOM.fn.init(selector, context);
  };

  DOM.addEvent = function(element, event, callback, useCapture){
    element.addEventListener(event, callback, useCapture || false);
    return element;
  };

  DOM.removeEvent = function(element, event, callback, useCapture){
    element.removeEventListener(event, callback, useCapture || false);
    return element;
  };

  DOM.ready = function(callback){
    var onReady = function(){
      callback(Projs);
    };
    if(/loaded|complete/.test(document.readyState)){
      onReady(); //just fire !
    }else{
      var func = function(){
        onReady();
        DOM(win.document).un('DOMContentLoaded', func);
      }
      DOM(win.document).on('DOMContentLoaded', func);
    }
  };

  /**
   * [fn description]
   * @type {Function}
   */
  DOM.fn = DOM.prototype = {
    init: function(selector, context){
      this.elements = [];
      var type = Projs.typeOf(selector);
      switch(type){
        case 'String':
          this.elements = this.find(selector, context);
          break;
        case 'Function':
          var callback = selector;
          DOM.ready(callback);
          break;
        default:
          if(/global|Document/.test(type)){
            var element = selector;
            this.elements = [ element ];
          }else{
            console.error('unknow selector: %s', selector);
          }
          break;
      }
      this.length = this.elements.length;
      return this;
    },
    find: function(selector, context){
      return (context || document).querySelectorAll(selector);
    },
    get: function(index){
      return this.elements[index];
    },
    on: function(event, callback){
      Projs.each(this.elements, function(key, element){
        DOM.addEvent(element, event, callback);
      });
      return this;
    }, 
    un: function(event, callback){
      Projs.each(this.elements, function(key, element){
        DOM.removeEvent(element, event, callback);
      });
      return this;
    },
    html: function(html){
      var element = this.get(0);
      if(html){
        element.innerHTML = html;
        return this;
      }else{
        return element.innerHTML;
      }
    }
  };
  //exports DOM .
  DOM.fn.init.prototype = DOM.fn;

  Projs.DOM = DOM;
  /**
   * [fn description]
   * @type {Object}
   */


  var App = function(options){ 
    return new App.fn.init(options);
  };

  App.fn = App.prototype = {
    init: function(options){
      this.controllers = {};
      return this;
    },
    controller: function(name, obj){
      obj.class_name = name;
      this.controllers[name] = obj; 
      return obj;
    },
  };

  App.fn.init.prototype = App.fn;

  Projs.App = App;

  var View = function(str){
    return new Function("obj",
      "var p=[],print=function(){p.push.apply(p,arguments);};" +
      // Introduce the data as local variables using with(){}
      "with(obj){p.push('" +
      // Convert the template into pure JavaScript
      str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'")
      + "');}return p.join('');");
  };

  Projs.View = View;

  var Router = function(routes) {
    return new Projs.Router.fn.init(routes);
  };

  Router.namedParam = /:\w+/g;

  Router.splatParam = /\*\w+/g;

  Router.fn = Router.prototype = {
    init: function(routes){
      var that = this;
      this.routes = routes || {};
      Projs.DOM(win).on('hashchange',function(){
        that.check(this.location.hash);
      });
    },
    on: function(route, callback){
      route = route.replace(Projs.Router.namedParam, '([^\/]+)');
      route = route.replace(Projs.Router.splatParam, '(.*?)');
      this.routes["^" + route + "$"] = callback;
    },
    check: function(hash){
      hash = hash.substring(1);// remove '#'
      for(var route in this.routes){
        var regex = new RegExp(route);
        if(regex.test(hash)){
          var callback = this.routes[route];
          var args = regex.exec(hash).slice(1);
          callback.apply(win, args);
        }
      }
    },
    start: function(){
      this.check(win.location.hash);
    }
  };

  Router.fn.init.prototype = Router.fn;

  Projs.Router = Router;

  Projs.App.fn.route = function(routes){
    var that = this;
    var thisArg = function(c, a){
      return {
        params: {},
        render: function(el){
          el = el || document.body;
          var t = this;
          var tmpl = Projs.DOM('#' + c + '-' + a);
          if(tmpl.length > 0){
            var view = new Projs.View(tmpl.html());
            var html = view(t);
            Projs.DOM(el).html(html);
          }else{
            console.log('template are missing .');
          }
        }
      };
    };
    var handler = function(route){
      return function(){
        var args = arguments;
        var route_tag = routes[route];
        var controller_and_action = route_tag.split('#');
        var controller_name = controller_and_action[0];
        var action_name     = controller_and_action[1];
        var controller = that.controllers[controller_name];
        if(controller){
          var action = controller[action_name];
          if(action){
            action.apply(thisArg(controller_name,action_name), args);
          }else{
            console.log('action not found:', action_name);
          }
        }else{
          console.log('controller not found:', controller_name);
        }
      };
    };
    var router = new Projs.Router();
    for(var route in routes){
      router.on(route, handler(route));
    }
    return this.router = router;
  };

  var Model = function(url, options){
      var that = this;
      this.url = url;
      this.options = options;
      Projs.each(options, function(key, option){
        if(/^\$/.test(key)){
          that[key] = option;
        }
      });
      return this;
  };

  Model.fn = Model.prototype = {
    $getUrl: function(model){
      if(this.options.$id && model[ this.options.$id ]){
        var id = model[ this.options.$id ];
        return this.url + '/' + id;
      }
      return this.url;
    },
    $save: function(model, callback){
      var url = this.$getUrl(model);
      Ajax.put(url, model, callback);
    },
    $find: function(model, callback){
      var url = this.$getUrl(model);
      Ajax.get(url, callback);
    },
    $delete: function(model, callback){
      var url = this.$getUrl(model);
      Ajax.delete(url, callback);
    },
    $create: function(model, callback){
      var url = this.$getUrl(model);
      Ajax.post(url, callback);
    }
  };

  Projs.Model = Model;

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

  var Scope = function(){
    
  };

  Scope.fn = Scope.prototype = {
    $watch: function(prop, callback){

    }
  };

  Projs.Scope = Scope;


  win['Projs'] = Projs;

})(window);
