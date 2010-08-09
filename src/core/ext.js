xui.events = {};
xui.empty = function(){};

// Add geo-specific capabilities to the framework
xui.extend({
	geo: function(cb){
		navigator.geolocation.getCurrentPosition(cb);
	}, 
	watch_geo: function(cb){
		return navigator.geolocation.watchPosition(cb);
	} 
});

// Add a basic wrapper around local, session-persistent storage!
xui.extend({
	value: function(k, v){
		try{
			localStorage.setItem(k, JSON.stringify(v));			
		}catch(e){
			if (e == QUOTA_EXCEEDED_ERR) {
				if(arguments[2]){
					arguments[2](e);
				}else{
					console.log("Quota exceeded.");
				}
			}
		}
	}, 
	key: function(k){
		return JSON.parse(localStorage.getItem(k));
	}
});

xui.tmpl = function(str, data){
		cache = {};
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = !/\W/.test(str) ?
		cache[str] = cache[str] ||
		xui.tmpl(document.getElementById(str).innerHTML) :

		// Generate a reusable function that will serve as a template
		// generator (and which will be cached).
		new Function("obj",
		"var p=[],print=function(){p.push.apply(p,arguments);};" +

		// Introduce the data as local variables using with(){}
		"with(obj){p.push('" +

		// Convert the template into pure JavaScript
		str
		.replace(/[\r\t\n]/g, " ")
		.split("{%").join("\t")
		.replace(/((^|%\})[^\t]*)'/g, "$1\r")
		.replace(/\t=(.*?)%\}/g, "',$1,'")
		.split("\t").join("');")
		.split("%}").join("p.push('")
		.split("\r").join("\\'")
		+ "');}return p.join('');");

		// Provide some basic currying to the user
		return data ? fn( data ) : fn;
};

xui.extend({
	tmpl: function(str, data){
		this.each(function(el){
			el.innerHTML = (xui.tmpl(str, data));
		});
	}
})
