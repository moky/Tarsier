;
/*!
 * Tarsier JavaScript Library v1.0.1
 * http://github.com/moky/Tarsier/
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
 *  Log
 *
 *  Author: moKy @ Jan. 15, 2014
 *
 */

(function(tarsier) {

	// get shared log layer
	function layer() {
		var id = tarsier.log.id || "tarsier_log";
		var div = document.getElementById(id);
		if (div) {
			div = $(div);
		} else {
			div = $("<div id=\"" + id + "\"></div>");
			div.css("z-index", 10000);
			div.css("position", "fixed");
			div.css("bottom", "0");
			
			div.appendTo(document.body);
		}
		return div;
	}
	
	function tick() {
		var div = layer();
		var array = div.children();
		if (array.length > 0) {
			array[0].remove();
		} else {
			div.remove();
			stop();
		}
	}
	
	var _interval = 0;
	
	function start() {
		stop(); // clear old timer
		_interval = setInterval(tick, tarsier.log.interval);
	}
	
	function stop() {
		if (_interval != 0) {
			clearInterval(_interval);
			_interval = 0;
		}
	}
	
	function log(info, type) {
		if (typeof(info) === "string") {
			info = info.replace(/\&/g, "&amp;");
			info = info.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
		}
		info = "<div class=\"" + type + "\">" + info + "</div>";
		
		start(); // reset the timer
		
		var div = layer();
		div.html(div.html() + "\r\n" + info);
	}
	
	//--------------------------------------------------------------------------
	
	tarsier.log = function(info) {
		log(info, "log");
	};
	
	tarsier.error = function(info) {
		log(info, "error");
	};
	
	tarsier.log.interval = 1000;
	
})(tarsier);
