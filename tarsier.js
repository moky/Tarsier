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
	
	/**
	 *  Import javascript file
	 */
	tarsier.importJS = function(args) {
		var src = args.src;
		var callback = args.callback;
		var doc = args.document || window.document;
		
		var script = doc.createElement("script");
		if (script) {
			script.type = "text/javascript";
			script.src = src;
			if (callback) {
				script.onload = callback;
				// IE
				script.onreadystatechange = function() {
					if (this.readyState == 'complete') {
						callback();
					}
				}
			}
			var head = doc.getElementsByTagName("head");
			if (head) {
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
	
	//--------------------------------------------------------------------------
	
	/**
	 *  Environment variables
	 */
	var __FILE__ = "https://raw.github.com/moky/Tarsier/master/tarsier.js"; // current filename
	var __PATH__ = "https://raw.github.com/moky/Tarsier/master/"; // current filepath
	
//	var scripts = document.getElementsByTagName("script");
//	if (scripts && scripts.length > 0) {
//		__FILE__ = scripts[scripts.length - 1].src;
//		var pos = __FILE__.lastIndexOf("/");
//		if (pos >= 0) {
//			__PATH__ = __FILE__.substr(0, pos + 1);
//			__FILE__ = __FILE__.substr(pos + 1);
//		}
//	}
	
	// include all dependences
//	tarsier.importJS({src: "http://code.jquery.com/jquery.min.js"});
	tarsier.importJS({src: __PATH__ + "3rd/jquery.js"});
	tarsier.importJS({src: __PATH__ + "3rd/jquery.tmpl.js"});
	tarsier.importJS({src: __PATH__ + "3rd/jquery.xml2json.js"});
	
	tarsier.importJS({src: __PATH__ + "http.js"});
	tarsier.importJS({src: __PATH__ + "xml.js"});
	tarsier.importJS({src: __PATH__ + "template.js"});
	tarsier.importJS({src: __PATH__ + "widget.js"});
	
})(tarsier);
