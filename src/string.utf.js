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
 *  String: UTF convertor
 *
 *  Author: moKy @ Jan. 20, 2014
 *
 */

!function(tarsier) {

	// convert string from 'utf-16' to 'utf-8'
	var utf16to8 = function(str) {
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
	};
	
	// convert string from 'utf-8' to 'utf-16'
	var utf8to16 = function(str) {
		var out, i, len, c;
		var char2, char3;
		
		out = "";
		len = str.length;
		i = 0;
		while (i < len) {
			c = str.charCodeAt(i++);
			switch (c >> 4) {
				case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
					// 0xxxxxxx
					out += str.charAt(i-1);
					break;
				case 12: case 13:
					// 110x xxxx   10xx xxxx
					char2 = str.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
					break;
				case 14:
					// 1110 xxxx  10xx xxxx  10xx xxxx
					char2 = str.charCodeAt(i++);
					char3 = str.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x0F) << 12) |
											   ((char2 & 0x3F) << 6) |
											   ((char3 & 0x3F) << 0));
					break;
			}
		}
		
		return out;
	};
	
	//--------------------------------------------------------------------------
	
	// convertors
	tarsier.setConvertor("utf-16", "utf-8", utf16to8);
	tarsier.setConvertor("utf-8", "utf-16", utf8to16);
	
}(tarsier);
