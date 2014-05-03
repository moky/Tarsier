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
 *  Handling HTTP request, Ajax, URLs, ...
 *
 *  Author: moKy @ Dec. 11, 2013
 *
 */

!function(tarsier) {

	var unescape = function(string) {
		var text = window.unescape(string);
		if (text != string && typeof(tarsier.String) === "function") {
			var str = new tarsier.String(text, "utf-8");
			text = str.convertTo("utf-16");
		}
		return text;
	};
	
	//--------------------------------------------------------------------------
	
	/**
	 *  Parse a URI string
	 */
	var parse = function(str) {
		var uri = {
			scheme   : "",  //  http
			username : "",  //  ...
			password : "",  //  ...
			domain   : "",  //  www.domain.com
			port     : 0,   //  80
			path     : "",  //  /current/path/
			filename : "",  //  filename
			query    : "",  //  a=1&b=2
			params   : {},  //  { a: 1, b: 2 }
			fragment : ""   //  anchor
		};
		
		var pos;
		
		// scheme
		pos = str.indexOf("://");
		if (pos > 0) {
			uri.scheme = str.substring(0, pos);
			str = str.substring(pos + 3);
			// default port
			if (uri.scheme === "http") {
				uri.port = 80;
			} else if (uri.scheme === "https") {
				uri.port = 443;
			} else if (uri.scheme === "ftp") {
				uri.port = 21;
			} else {
				//...
			}
			
			// domain
			pos = str.indexOf("/");
			if (pos >= 0) {
				uri.domain = str.substring(0, pos);
				str = str.substring(pos);
				// username
				pos = uri.domain.lastIndexOf("@");
				if (pos > 0) {
					uri.username = unescape(uri.domain.substring(0, pos));
					uri.domain = uri.domain.substring(pos + 1);
					// password
					pos = uri.username.indexOf(":");
					if (pos > 0) {
						uri.password = uri.username.substring(pos + 1);
						uri.username = uri.username.substring(0, pos);
					}
				}
				// port
				pos = uri.domain.lastIndexOf(":");
				if (pos > 0) {
					uri.port = uri.domain.substring(pos + 1);
					uri.domain = uri.domain.substring(0, pos);
				}
			}
		}
		
		// fragment
		pos = str.indexOf("#");
		if (pos > 0) {
			uri.fragment = unescape(str.substring(pos + 1));
			str = str.substring(0, pos);
		}
		
		// query string
		pos = str.indexOf("?");
		if (pos > 0) {
			uri.query = str.substring(pos + 1);
			str = str.substring(0, pos);
			// params
			var pairs = uri.query.split("&");
			for (var i = pairs.length - 1; i >= 0; --i) {
				pos = pairs[i].indexOf("=");
				if (pos > 0) {
					uri.params[pairs[i].substring(0, pos)] = unescape(pairs[i].substring(pos + 1));
				}
			}
		}
		
		pos = str.lastIndexOf("/");
		if (pos > 0) {
			uri.filename = str.substring(pos + 1);
			uri.path = str.substring(0, pos + 1);
		}
		
		return uri;
	};
	
	/**
	 *  Trim a URL string by killing "../"
	 */
	var trim = function(str) {
		var prefix = "";
		var suffix = "";
		var pos;
		
		// prefix
		pos = str.indexOf("://");
		if (pos > 0) {
			pos = str.indexOf("/", pos + 3);
			if (pos < 0) return str;
			pos += 1;
			prefix = str.substring(0, pos);
			str = str.substring(pos);
		}
		
		// suffix
		pos = str.indexOf("?");
		if (pos < 0) {
			pos = str.indexOf("#");
		}
		if (pos > 0) {
			suffix = str.substring(pos);
			str = str.substring(0, pos);
		}
		
		var array = str.split("/");
		var i, j = 0;
		for (i = 0; i < array.length; ++i) {
			if (array[i] == "") {
				// error?
			} else if (array[i] === ".." && j > 0 && array[j - 1] !== "..") {
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
	};
	
	//--------------------------------------------------------------------------
	
	// namespace: URI
	tarsier.URI = {
		parse: parse,
		trim: trim,
	}; // EOF 'tarsier.URI'
	
	// namespace: HTTP
	tarsier.HTTP = {
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
		}
		
	}; // EOF 'tarsier.HTTP'
	
}(tarsier);
