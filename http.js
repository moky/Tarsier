;
/*!
 * Tarsier JavaScript Library v1.0.1
 * https://github.com/moky/Tarsier/
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
 *  Handling HTTP request, Ajax, URLs, ...
 *
 *  Author: moKy @ Nov.11, 2013
 *
 */

(function(tarsier) {
	
	// namespace: http
	tarsier.http = {
		/**
		 *  HTTP Request
		 */
		request: function(url) {
			return this.ajax({ url: url, dataType: "text", async:false }).responseText;
		},
		ajax: function(params) {
			try {
				return $.ajax(params);
			} catch(e) {
				return e;
			}
		},
		
		/**
		 *  Parse a URI string
		 */
		parseURI: function(str) {
			var uri = {
				scheme: "",   //  http
				domain: "",   //  www.domain.com
				port: 0,      //  80
				path: "",     //  /current/path/
				filename: "", //  filename
				query: "",    //  a=1&b=2
				params: {},   //  { a: 1, b: 2 }
				fragment: ""  //  anchor
			};
			
			var pos;
			
			// scheme
			pos = str.indexOf("://");
			if (pos > 0) {
				uri.scheme = str.substr(0, pos);
				str = str.substr(pos + 3);
				// default port
				if (uri.scheme == "http" || uri.scheme == "https") {
					uri.port = 80;
				} else if (uri.scheme == "ftp") {
					uri.port = 21;
				}
				
				// domain
				pos = str.indexOf("/");
				if (pos >= 0) {
					uri.domain = str.substr(0, pos);
					str = str.substr(pos);
					// port
					pos = uri.domain.indexOf(":");
					if (pos > 0) {
						uri.port = uri.domain.substr(pos + 1);
						uri.domain = uri.domain.substr(0, pos);
					}
				}
			}
	
			// fragment
			pos = str.indexOf("#");
			if (pos > 0) {
				uri.fragment = str.substr(pos + 1);
				str = str.substr(0, pos);
			}
			
			// query string
			pos = str.indexOf("?");
			if (pos > 0) {
				uri.query = str.substr(pos + 1);
				str = str.substr(0, pos);
				// params
				var pairs = uri.query.split("&");
				for (var i = pairs.length - 1; i >= 0; --i) {
					pos = pairs[i].indexOf("=");
					if (pos > 0) {
						uri.params[pairs[i].substr(0, pos)] = pairs[i].substr(pos + 1);
					}
				}
			}
			
			pos = str.lastIndexOf("/");
			if (pos > 0) {
				uri.filename = str.substr(pos + 1);
				uri.path = str.substr(0, pos + 1);
			}
			
			return uri;
		},
		
		/**
		 *  Trim a URL string by killing "../"
		 */
		trimURI: function(str) {
			var prefix = "";
			var suffix = "";
			var pos;
	
			// prefix
			pos = str.indexOf("://");
			if (pos > 0) {
				pos = str.indexOf("/", pos + 3);
				if (pos < 0) return str;
				pos += 1;
				prefix = str.substr(0, pos);
				str = str.substr(pos);
			}
	
			// suffix
			pos = str.indexOf("?");
			if (pos < 0) {
				pos = str.indexOf("#");
			}
			if (pos > 0) {
				suffix = str.substr(pos);
				str = str.substr(0, pos);
			}
			
			var array = str.split("/");
			var i, j = 0;
			for (i = 0; i < array.length; ++i) {
				if (array[i] == "") {
					// error?
				} else if (array[i] == ".." && j > 0 && array[j - 1] != "..") {
					--j;
				} else {
					array[j] = array[i];
					++j;
				}
			}
			
			if (j == 0) {
				return prefix + suffix;
			}
	
			str = array[0];
			for (i = 1; i < j; ++i) {
				str += "/" + array[i];
			}
	
			return prefix + str + suffix;
		}
	}; // EOF 'tarsier.http'
	
})(tarsier);
