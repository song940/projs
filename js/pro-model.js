;(function(win, Projs, undefined){

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

})(window, Projs);