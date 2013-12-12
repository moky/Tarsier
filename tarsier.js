;
/*!
 * Tarsier JavaScript Library v1.0.1
 * http://moky.github.com/Tarsier/
 *
 * Includes jquery.js
 * http://jquery.com/
 *
 * Copyright 2013 moKy at slanissue.com
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-12-11 T10:43Z
 */

if (typeof(window.tarsier) != "object") {
	window.tarsier = {
		version: "1.0.1"
	};
}

// base functions
(function(tarsier) {

	// count of current importing tasks
	tarsier.importings = -1; // init
	/**
	 *  Import javascript file
	 */
	tarsier.importJS = function(args) {
		var src = args.src;
		var callback = args.callback;
		var doc = args.document || window.document;
		
		if (tarsier.importings < 0) {
			tarsier.importings = 0; // start
		}
		
		var script = doc.createElement("script");
		if (script) {
			script.type = "text/javascript";
			script.src = src;
			// callback
			script.onload = function() {
				tarsier.importings--;
				if (callback) callback();
			}
			script.onreadystatechange = function() { // IE
				if (this.readyState == "complete") {
					--tarsier.importings;
					if (callback) callback();
				}
			}
			// load
			var head = doc.getElementsByTagName("head");
			if (head) {
				tarsier.importings++;
				head.item(0).appendChild(script);
			}
		}
	};
	
	/**
	 *  Import css file
	 */
	tarsier.importCSS = function(args) {
		var href = args.href;
		var doc = args.document || window.document;
		
		var link = doc.createElement("link");
		if (link) {
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = href;
			var head = doc.getElementsByTagName("head");
			if (head) {
				head.item(0).appendChild(link);
			}
		}
	};
	
	// importing finished?
	tarsier.isReady = function() {
		return tarsier.importings == 0;
	}
	
	tarsier.readys = [];
	
	// window.onLoad
	tarsier.ready = function(func) {
		if (func) {
			tarsier.readys[tarsier.readys.length] = func;
		}
		if (this.isReady()) {
			for (var i = 0; i < tarsier.readys.length; ++i) {
				tarsier.readys[i]();
			}
			tarsier.readys = [];
		}
	};
	
	window.onload = function() {
		tarsier.ready();
	}
	
	//--------------------------------------------------------------------------
	
	/**
	 *  Environment variables
	 */
	var __FILE__ = "https://raw.github.com/moky/Tarsier/master/tarsier.js"; // current filename
	var __PATH__ = "https://raw.github.com/moky/Tarsier/master/"; // current filepath
	
	var scripts = document.getElementsByTagName("script");
	if (scripts && scripts.length > 0) {
		__FILE__ = scripts[scripts.length - 1].src;
		var pos = __FILE__.lastIndexOf("/");
		if (pos >= 0) {
			__PATH__ = __FILE__.substr(0, pos + 1);
			__FILE__ = __FILE__.substr(pos + 1);
		}
	}
	
	// include all dependences
	tarsier.importJS({src: "http://code.jquery.com/jquery.min.js"});
	tarsier.importJS({src: "http://borismoore.github.io/jquery-tmpl/jquery.tmpl.min.js"});
	
//	tarsier.importJS({src: __PATH__ + "3rd/jquery.js"});
//	tarsier.importJS({src: __PATH__ + "3rd/jquery.tmpl.js"});
	tarsier.importJS({src: __PATH__ + "3rd/jquery.xml2json.js"});
	
	tarsier.importJS({src: __PATH__ + "http.js"});
	tarsier.importJS({src: __PATH__ + "xml.js"});
	tarsier.importJS({src: __PATH__ + "template.js"});
	tarsier.importJS({src: __PATH__ + "widget.js"});
	
})(tarsier);
