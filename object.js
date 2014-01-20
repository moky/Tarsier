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

(function(tarsier) {

	// flat the element into a json string
	function flat(element, indent) {
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
				string += _INDENT_ + "/* " + i + " */ " + flat(element[i], _INDENT_) + "," + _CRLF_;
			}
			return "[" + _CRLF_ + string + indent + "]";
		} else if (type === "object") {
			var string = "";
			for (var key in element) {
				string += _INDENT_ + "\"" + key + "\" : " + flat(element[key], _INDENT_) + "," + _CRLF_;
			}
			return "{" + _CRLF_ + string + indent + "}";
		} else if (type === "string") {
			return "\"" + element + "\"";
		} else {
			return element;
		}
	}
	
	//--------------------------------------------------------------------------
	
	// class: Object
	tarsier.Object = function(object) {
		this.data = object;
		return this;
	};
	
	tarsier.Object.prototype.json = function() {
		return flat(this.data);
	};
	
	tarsier.Object.prototype.description = function() {
		return flat(this.data);
	};
	
})(tarsier);
