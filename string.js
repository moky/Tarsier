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
 *  String utilities
 *
 *  Author: moKy @ Jan. 14, 2014
 *
 */

(function(tarsier) {
	
	// convert string from 'utf-16' to 'utf-8'
	function utf16to8(str) {
		var out, i, len, c;
		out = "";
		len = str.length;
		for (i = 0; i < len; i++) {
			c = str.charCodeAt(i);
			if ((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i);
			} else if (c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
				out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
				out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
			} else {
				out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
				out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
			}
		}
		return out;
	}
	
	//--------------------------------------------------------------------------
	
	// class: String
	tarsier.String = function(string, charset) {
		this.charset = charset || "utf-16";
		this.data = string;
		return this;
	};
	
	tarsier.String.prototype.convertTo = function(charset) {
		if (this.charset === "utf-16") {
			if (charset === "utf-8") {
				return utf16to8(this.data);
			}
		}
		tarsier.log("[Tarsier] string.js: unsupported charsets (" + this.charset + " -> " + charset + ")");
		return this.data;
	};
	
})(tarsier);
