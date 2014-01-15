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
		var div = document.getElementById(tarsier.log.id);
		if (div) {
			div = $(div);
		} else {
			div = $("<div id=\"" + tarsier.log.id + "\"></div>");
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
		stop();
		_interval = setInterval(tick, tarsier.log.interval);
	}
	
	function stop() {
		if (_interval != 0) {
			clearInterval(_interval);
			_interval = 0;
		}
	}
	
	//--------------------------------------------------------------------------
	
	tarsier.log = function(string, type) {
		type = type || "log";
		var div = layer();
		string = string.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
		string = "<div class=\"" + type + "\">" + string + "</div>";
		div.html(div.html() + "\r\n" + string);
		start();
	};
	
	tarsier.error = function(string) {
		this.log(string, "error");
	};
	
	tarsier.log.id = "tarsier_log";
	tarsier.log.interval = 2000;
	
})(tarsier);
