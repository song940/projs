(function(win, jq, undefined){
  
  var Projs = function(){
  
  };

  Projs.fn = {
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

  Projs.App = function(options){ 
    return Projs.fn.init(options); 
  };

  Projs.View = function(options){
    return Projs.View.fn.init(options);
  };
  
  Projs.View.fn = {
    init: function(){
      return this;
    },
    render: function(el){
      $(el).html(this.name);
      console.log('render:' ,this);
    }
  };

  Projs.Router = function(routes) {
    return Projs.Router.fn.init(routes);
  };

  Projs.Router.namedParam = /:\w+/g;

  Projs.Router.splatParam = /\*\w+/g;

  Projs.Router.fn = Projs.Router.prototype = {
    init: function(routes){
      var that = this;
      this.routes = routes || {};
      $(win).on('hashchange',function(){
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

  Projs.fn.route = function(routes){
    var that = this;
    var view = new Projs.View();
    var thisArg = {
      params: {},
      render: view.render
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
            action.apply(thisArg, args);
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

  win['Projs'] = Projs;

})(window, jQuery);
