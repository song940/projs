;(function(win, Projs, undefined){
	
  var Tmpl = function(str){
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

  Projs.Tmpl = Tmpl;
  
})(window, Projs);