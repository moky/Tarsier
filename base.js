;
/*!
 * Tarsier JavaScript Library v1.0.1
 * http://github.com/moky/Tarsier/
 *
 * Copyright 2013 moKy at slanissue.com
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-12-11 T10:43Z
 */

/**
 *
 *  Base
 *
 *  Author: moKy @ Dec. 11, 2013
 *
 */

if (typeof(window.tarsier) !== "object") {
	window.tarsier = {
		version: "1.0.1"
	};
}

// base functions
(function(tarsier) {
	
	function alert(message) {
		tarsier.log(message);
	}
	
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
		tarsier.base.importings.shift(); // remove current task
		if (tarsier.base.importings.length > 0) {
			tarsier.base.importings[0].run(); // run next task
		} else {
			tarsier.events.onload(); // all tasks finished
		}
		return this;
	};
	
	// import js
	tarsier.base.Task.prototype.js = function() {
		var task = this;
		var doc = task.document || window.document;
		
		var script = doc.createElement("script");
		if (script) {
			script.type = "text/javascript";
			script.src = task.url;
			script.async = task.async;
			script.charset = task.charset || "UTF-8";
			
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
				if (this.readyState === "complete") {
					script.onload();
				}
			}
			
			// load
			var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
			if (head) {
				head.appendChild(script);
			}
		}
		return this;
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
			
			// load
			var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
			if (head) {
				head.appendChild(link);
			}
		}
		
		task.finished();
		return this;
	};
	
	// run a task
	tarsier.base.Task.prototype.run = function() {
		if (this.type === "text/javascript") {
			this.js();
		} else if (this.type === "text/css") {
			this.css();
		} else {
			alert("[Tarsier] task run: could not happen");
		}
		return this;
	};
	
	// check duplicated
	tarsier.base.Task.prototype.isDuplicated = function() {
		for (var i = 0; i < tarsier.base.importings.length; ++i) {
			if (tarsier.base.importings[i].url === this.url) return true;
		}
		return false;
	};
	
	//
	// import something
	//
	tarsier.base.import = function(args) {
		var task;
		var type = args.type;
		if (type === "text/javascript") {
			task = new this.Task({url: args.src,
								 type: "text/javascript",
								 charset: args.charset,
								 async: args.async,
								 callback: args.callback});
		} else if (type === "text/css") {
			task = new this.Task({url: args.href,
								 type: "text/css"});
		} else {
			alert("[Tarsier] unknown import type: " + type);
			return this;
		}
		
		if (task.isDuplicated()) {
			alert("[Tarsier] duplicated url: " + task.url);
			return this;
		}
		
		this.importings[this.importings.length] = task;
		if (this.importings.length == 1) {
			task.run();
		}
		return this;
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
		if (name === "load" || name === "onload" || name === "ready") {
			this.handlers.onload[this.handlers.onload.length] = handler;
		} else {
			alert("[Tarsier] unknown event: " + name + " handler: " + handler);
		}
		return this;
	};
	
	tarsier.events.onload = function() {
		if (this.isReady()) {
			var handler = null;
			while (handler = this.handlers.onload.shift()) {
				handler();
			}
		}
		return this;
	};
	
	//--------------------------------------------------------------------------
	
	/**
	 *  import javascript file
	 */
	tarsier.importJS = function(url, callback) {
		this.base.import({
						 src: url,
						 type: "text/javascript",
						 callback: callback
		});
		return this;
	};
	/**
	 *  import style sheet
	 */
	tarsier.importCSS = function(url) {
		this.base.import({
						 href: url,
						 type: "text/css"
		});
		return this;
	};
	
	/**
	 *  adding handler for 'onload' event
	 */
	tarsier.ready = function(func) {
		this.events.add("onload", func);
		return this;
	};
	
	var window_onload = window.onload; // save old handler
	window.onload = function() {
		tarsier.events.isWindowLoaded = true;
		tarsier.events.onload();
		if (typeof(window_onload) === "function") {
			window_onload(); // call old handler
		}
	};
	
})(tarsier);
