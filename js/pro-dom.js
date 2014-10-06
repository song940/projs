;(function(win, Projs, undefined){
	
  Projs.define(function(){

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
        return Projs.toArray((context || document).querySelectorAll(selector));
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
      },
      children: function(){
        var element = this.get(0);
        return element.childNodes;
      },
      tmpl: function(data){
        var rep = function(text){
          return text && text.replace(/{{(.*)}}/g, function(match, key){
            return data[ key.trim() ];
          });
        };
        var nodes = this.children();
        for(var i=0;i<nodes.length;i++){
          var node = nodes[i];
          if(node && node.nodeType == 1){
            node.textContent = rep(node.textContent);
          }
        }
        return this;
      },
      addClass: function(className){
        Projs.each(this.elements, function(key, element){
          var classNames = element.className.trim().split(/\s+/);
          classNames.push(className);
          element.className = Projs.uniq(classNames).join(' ');
        });
        return this;
      },
      removeClass: function(className){
        Projs.each(this.elements, function(key, element){
          var classNames = element.className.trim().split(/\s+/);
          var index = classNames.indexOf(className);
          classNames.splice(index, 1);
          element.className = classNames.join(' ');
        });
        return this;
      },
      each: function(callback){
        Projs.each(this.elements, callback);
      },
      hide: function(){
        this.each(function(key, element){
          element.style.display = 'none';
        });
      }
    };
    //exports DOM .
    DOM.fn.init.prototype = DOM.fn;

    return DOM;
  });

})(window, Projs);