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

/**
 *
 *  main
 *
 *  Author: moKy @ Nov.11, 2013
 *
 */

if (typeof(window.tarsier) != "object") {
	window.tarsier = {
		version: "1.0.1"
	};
}

// base functions
(function(tarsier) {

	////////////////////////////////////////////////////////////////////////////
	//
	//  namespace: base
	//
	tarsier.base = {
		// importing tasks
		importings: []
	};
	
	/**
	 *  class: Task
	 */
	tarsier.base.Task = function(args) {
		this.url = args.url;
		this.type = args.type;
		this.callback = args.callback;
		return this;
	};
	
	// finished current task
	tarsier.base.Task.prototype.finished = function() {
		tarsier.base.importings.splice(0, 1); // remove current task
		if (tarsier.base.importings.length > 0) {
			tarsier.base.importings[0].run(); // run next task
		} else {
			tarsier.events.onload(); // all task finished
		}
	};
	
	// import js
	tarsier.base.Task.prototype.js = function() {
		var task = this;
		var doc = task.document || window.document;
		
		var script = doc.createElement("script");
		if (script) {
			script.type = "text/javascript";
			script.src = task.url;
			
			// callback
			script.onload = function() {
				try {
					if (task.callback) task.callback();
				} catch(e) {
					alert("[Tarsier] callback error: " + e);
				}
				task.finished();
			}
			script.onreadystatechange = function() { // IE
				if (this.readyState == "complete") {
					script.onload();
				}
			}
			
			// load
			var head = doc.getElementsByTagName("head");
			if (head) {
				head.item(0).appendChild(script);
			}
		}
	};
	
	// import css
	tarsier.base.Task.prototype.css = function() {
		var task = this;
		var doc = task.document || window.document;
		
		var link = doc.createElement("link");
		if (link) {
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = task.url;
			var head = doc.getElementsByTagName("head");
			if (head) {
				head.item(0).appendChild(link);
			}
		}
		
		task.finished();
	};
	
	// run a task
	tarsier.base.Task.prototype.run = function() {
		if (this.type == "text/javascript") {
			this.js();
		} else if (this.type == "text/css") {
			this.css();
		} else {
			alert("[Tarsier] task run: could not happen");
		}
	};
	
	//
	// import something
	//
	tarsier.base.import = function(args) {
		var task;
		var type = args.type;
		if (type == "text/javascript") {
			task = new this.Task({url: args.src, type: args.type, callback: args.callback});
		} else if (type == "text/css") {
			task = new this.Task({url: args.href, type: args.type, callback: args.callback});
		} else {
			alert("[Tarsier] unknown import type: " + type);
			return;
		}
		this.importings[this.importings.length] = task;
		if (this.importings.length == 1) {
			task.run();
		}
	};
	
	////////////////////////////////////////////////////////////////////////////
	//
	//  namespace: events
	//
	
	tarsier.events = {
		
		isWindowLoaded: false,
		
		handlers: {
			onload: []
		}
	};
	
	// window loaded & importing finished?
	tarsier.events.isReady = function() {
		return this.isWindowLoaded && tarsier.base.importings.length == 0;
	};
	
	// add handler for event name
	tarsier.events.add = function(name, handler) {
		if (!name || !handler) return;
		if (name == "load" || name == "onload" || name == "ready") {
			this.handlers.onload[this.handlers.onload.length] = handler;
		} else {
			alert("[Tarsier] unknown event: " + name + " handler: " + handler);
		}
	};
	
	tarsier.events.onload = function() {
		if (this.isReady()) {
			for (var i = 0; i < this.handlers.onload.length; ++i) {
				this.handlers.onload[i]();
			}
			this.handlers.onload = [];
		}
	};
	
	//--------------------------------------------------------------------------
	
	/**
	 *  import javascript file
	 */
	tarsier.importJS = function(args) {
		args.type = "text/javascript";
		this.base.import(args);
	};
	/**
	 *  import style sheet
	 */
	tarsier.importCSS = function(args) {
		args.type = "text/css";
		this.base.import(args);
	};
	
	/**
	 *  adding handler for 'onload' event
	 */
	tarsier.ready = function(func) {
		this.events.add("onload", func);
	};
	
	window.onload = function() {
		tarsier.events.isWindowLoaded = true;
		tarsier.events.onload();
	};
	
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
//	tarsier.importJS({src: "http://code.jquery.com/jquery.min.js"});
//	tarsier.importJS({src: "http://borismoore.github.io/jquery-tmpl/jquery.tmpl.min.js"});
//	tarsier.importJS({src: "http://jquery-xml2json-plugin.googlecode.com/svn/trunk/jquery.xml2json.js"});
	
	tarsier.importJS({src: __PATH__ + "3rd/jquery.min.js"});
	tarsier.importJS({src: __PATH__ + "3rd/jquery.tmpl.min.js"});
	tarsier.importJS({src: __PATH__ + "3rd/jquery.xml2json.js"});
	
	tarsier.importJS({src: __PATH__ + "http.js"});
	tarsier.importJS({src: __PATH__ + "xml.js"});
	tarsier.importJS({src: __PATH__ + "template.js"});
	tarsier.importJS({src: __PATH__ + "widget.js"});
	
})(tarsier);
