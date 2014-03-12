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
 *  Object utilities
 *
 *  Author: moKy @ Jan. 17, 2014
 *
 */

!function(tarsier) {

	// flat the element into a json string
	var json = function(element) {
		var type = typeof(element);
		if (type === "object" && element instanceof Array) {
			type = "array";
		}
		
		if (type === "array") {
			var string = "";
			for (var i = 0; i < element.length; ++i) {
				string += json(element[i]) + ",";
			}
			if (string.length > 0) {
				string = string.substr(0, string.length - 1); // erase last ','
			}
			return "[" + string + "]";
		} else if (type === "object") {
			var string = "";
			for (var key in element) {
				string += "\"" + key + "\":" + json(element[key]) + ",";
			}
			if (string.length > 0) {
				string = string.substr(0, string.length - 1); // erase last ','
			}
			return "{" + string + "}";
		} else if (type === "string") {
			var string = element;
			string = string.replace(/"/g, "\\\"");
			return "\"" + string + "\"";
		} else {
			return element;
		}
	};
	
	// flat the element into a string
	var desc = function(element, indent) {
		indent = indent || "";
		var _INDENT_ = indent + "\t";
		var _CRLF_ = "\r\n";
		
		var type = typeof(element);
		if (type === "object" && element instanceof Array) {
			type = "array";
		}
		
		if (type === "array") {
			var string = "";
			for (var i = 0; i < element.length; ++i) {
				string += _CRLF_ + _INDENT_ + "/* " + i + " */ " + desc(element[i], _INDENT_) + ",";
			}
			if (string.length > 0) {
				string = string.substr(0, string.length - 1); // erase last ','
			}
			return "[" + string + _CRLF_ + indent + "]";
		} else if (type === "object") {
			var string = "";
			for (var key in element) {
				string += _CRLF_ + _INDENT_ + "\"" + key + "\" : " + desc(element[key], _INDENT_) + ",";
			}
			if (string.length > 0) {
				string = string.substr(0, string.length - 1); // erase last ','
			}
			return "{" + string + _CRLF_ + indent + "}";
		} else if (type === "string") {
			var string = element;
			string = string.replace(/"/g, "\\\"");
			return "\"" + string + "\"";
		} else {
			return element;
		}
	};
	
	//--------------------------------------------------------------------------
	
	// class: Object
	tarsier.Object = function(object) {
		this.data = object;
		return this;
	};
	
	tarsier.Object.prototype.json = function() {
		return json(this.data);
	};
	
	tarsier.Object.prototype.toString = function() {
		return desc(this.data);
	};
	
}(tarsier);
