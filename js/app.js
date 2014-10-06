var $import = Projs.Loader;

$import('css/pro-reset.css');
$import('css/pro-base.css');
$import('css/pro-grid.css');
$import('css/pro-navs.css');
$import('css/pro-forms.css');

$import('css/stylesheet.css');

$import('js/pro.js');

;(function(win, undefined){
	$import('js/pro-dom.js', function(){
		var data = {
			name: 'Lsong',
			age: 0
		};
		var i = 0;
		setInterval(function(){
			data[ 'age' ] = ++i;
		},1000);
		
		Object.observe(data, function(cahnges){
			for(var i=0;i<cahnges.length;i++){
				console.log(cahnges[i]);
			}
		});
	});

})(window);
