;(function(win, Projs, undefined){

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
  
})(window, Projs);