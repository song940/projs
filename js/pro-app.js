;(function(win, Projs, undefined){

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
  
})(window, Projs);