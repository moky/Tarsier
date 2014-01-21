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
 *  Include all
 *
 *  Author: moKy @ Dec. 11, 2013
 *
 */

// base functions
(function(tarsier) {
	
	/**
	 *  Environment variables
	 */
	var __FILE__ = "tarsier.js";                     // current filename
	var __PATH__ = "http://moky.github.io/Tarsier/"; // current filepath
	
	var scripts = document.getElementsByTagName("script");
	if (scripts) {
		for (var i = scripts.length - 1; i >= 0; --i) {
			var pos = scripts[i].src.lastIndexOf(__FILE__);
			if (pos > 0) {
				__PATH__ = scripts[i].src.substring(0, pos);
				break;
			}
		}
	}
	
	// include all dependences
	if (false) {
		tarsier.importJS("http://code.jquery.com/jquery.min.js");
		tarsier.importJS("http://borismoore.github.io/jquery-tmpl/jquery.tmpl.min.js");
		tarsier.importJS("http://jquery-xml2json-plugin.googlecode.com/svn/trunk/jquery.xml2json.js");
//		tarsier.importJS("http://steamdev.com/snippet/js/jquery.snippet.min.js");
//		tarsier.importCSS("http://steamdev.com/snippet/css/jquery.snippet.min.css");
//		tarsier.importJS("http://jeromeetienne.github.io/jquery-qrcode/jquery.qrcode.min.js");
	} else {
		tarsier.importJS(__PATH__ + "3rd/jquery.min.js");
		tarsier.importJS(__PATH__ + "3rd/jquery.tmpl.min.js");
		tarsier.importJS(__PATH__ + "3rd/jquery.xml2json.js");
//		tarsier.importJS(__PATH__ + "3rd/jquery.snippet.min.js");
//		tarsier.importCSS(__PATH__ + "3rd/jquery.snippet.min.css");
//		tarsier.importJS(__PATH__ + "3rd/jquery.qrcode.min.js");
	}
	
	tarsier.importJS(__PATH__ + "log.js");
	tarsier.importJS(__PATH__ + "object.js");
	tarsier.importJS(__PATH__ + "string.js");
	tarsier.importJS(__PATH__ + "string.utf.js");
	tarsier.importJS(__PATH__ + "string.gb2312.js");
	tarsier.importJS(__PATH__ + "string.base64.js");
	tarsier.importJS(__PATH__ + "xml.js");
	tarsier.importJS(__PATH__ + "http.js");
	tarsier.importJS(__PATH__ + "template.js");
	tarsier.importJS(__PATH__ + "widget.js");
	
})(tarsier);
