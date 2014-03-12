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

!function(tarsier) {

	// get shared log tray
	var tray = function() {
		var id = tarsier.log.id || "tarsier_log";
		var div = document.getElementById(id);
		if (div) {
			div = $(div);
		} else {
			div = $("<div id=\"" + id + "\"></div>");
			div.css("z-index", 10000);
			div.css("position", "fixed");
			div.css("bottom", "0");
			// events
			div.mouseover(stop).mouseout(start);
			
			div.appendTo(document.body || document.documentElement);
		}
		return div;
	};
	
	var tick = function() {
		// clear timers
		_timer1 = 0;
		_timer2 = 0;
		
		var div = tray();
		var array = div.children();
		if (array.length > 0) {
			$(array[0]).remove();
			_timer2 = setTimeout(tick, 100);
		} else {
			div.remove();
		}
	};
	
	var _timer1 = 0;
	var _timer2 = 0;
	
	var stop1 = function() {
		if (_timer1 != 0) {
			// stop timer
			clearTimeout(_timer1);
			_timer1 = 0;
		}
	};
	var stop2 = function() {
		if (_timer2 != 0) {
			// stop timer
			clearTimeout(_timer2);
			_timer2 = 0;
		}
	};
	var stop = function() {
		stop1();
		stop2();
	};
	
	var start = function() {
		stop();
		_timer1 = setTimeout(tick, tarsier.log.interval);
	};
	
	var show = function(info, type) {
		tarsier.log.history.push({type: type, message: info});
		
		if (typeof(info) === "string") {
			info = info.replace(/\&/g, "&amp;");
			info = info.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
		}
		var item = $("<div class=\"" + type + "\">" + info + "</div>");
		
		start(); // reset the timer
		
		var div = tray();
		item.appendTo(div);
	};
	
	//--------------------------------------------------------------------------
	
	// log
	var log = function(info) {
		// console
		if (window.console && window.console.log) {
			window.console.log(info);
		}
		// show
		if (tarsier.log.debug) {
			show(info, "log");
		}
	};
	
	// warn
	var warn = function(info) {
		// console
		if (window.console && window.console.warn) {
			window.console.warn(info);
		}
		// show
		if (tarsier.log.debug) {
			show(info, "warn");
		}
	};
	
	// error
	var error = function(info) {
		// console
		if (window.console && window.console.error) {
			window.console.error(info);
		}
		// show
		if (tarsier.log.debug) {
			show(info, "error");
		}
	};
	
	// logs
	tarsier.log = log;
	tarsier.warn = warn;
	tarsier.error = error;
	
	// configuration
	tarsier.log.debug = true;
	tarsier.log.interval = 5000; // timer1's interval
	tarsier.log.history = [];
	
}(tarsier);
