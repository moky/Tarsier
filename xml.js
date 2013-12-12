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
 *  Processing XML
 *
 *  Author: moKy @ Nov.11, 2013
 *
 */

(function(tarsier) {
	
	// class: XML
	tarsier.XML = function(data) {
		this.jsonObj = null;
		try {
			this.jsonObj = $.xml2json(data);
		} catch(e) {
			//alert("XML parse error: " + e);
		}
		return this;
	};
	
	tarsier.XML.prototype.json = function() {
		return this.jsonObj;
	};
	
})(tarsier);
