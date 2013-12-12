;
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
