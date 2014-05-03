;
/*!
 * Tarsier JavaScript Library v1.1.0
 * http://github.com/moky/Tarsier/
 *
 * Includes jquery.js
 * http://jquery.com/
 * Includes jquery.xml2json.js
 * http://jquery-xml2json-plugin.googlecode.com/
 *
 * Copyright 2014 moKy at slanissue.com
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-03-21 T11:02Z
 */

/**
 *
 *  Processing Numbers
 *
 *  Author: moKy @ May. 3, 2014
 *
 */

!function(tarsier) {
	
	var format = function(number, count/* default: 3 */) {
		var string = number.toString();
		if (string.length < 4) {
			return string;
		}
		count = count || 3;
		var pos = string.indexOf(".");
		if (pos < 0) {
			pos = string.length;
		}
		// preccessing sub-string after the point
		var count1 = count + 1;
		for (var i = pos + count1; i < string.length; i += count1) {
			string = string.substring(0, i) + "," + string.substring(i);
		}
		// precessing sub-string before the point
		var first = number < 0 ? 1 : 0;
		for (var i = pos - count; i > first; i -= count) {
			string = string.substring(0, i) + "," + string.substring(i);
		}
		return string;
	};
	
	//--------------------------------------------------------------------------
	
	tarsier.Number = {
		format: format,
	};
	
}(tarsier);
