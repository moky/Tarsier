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
 *  Processing templates
 *
 *  Author: moKy @ Nov.11, 2013
 *
 */

(function(tarsier) {
	
	// class: Template
	tarsier.Template = function(html, url) {
		this.data = html;
		this.url = url;
		return this.init(html, url);
	};
	
	/**
	 *  Repalce all "src" and "href" string to absulute URLs
	 */
	tarsier.Template.prototype.init = function(html, url) {
		
		function standardize_urls(text, start, end, domain, path) {
			var res = "";
			
			var p1, p2 = 0;
			var url;
			
			while ((p1 = html.indexOf(start, p2)) > 0) {
				p1 += start.length;
				res += html.substr(p2, p1 - p2);
				
				p2 = html.indexOf(end, p1);
				if (p2 < p1) {
					p2 = p1;
					break; // error
				}
				if (p2 == p1) continue; // blank url
				
				url = html.substr(p1, p2 - p1);
				if (url.indexOf("://") > 0) {
					res += tarsier.http.trimURI(url);
				} else if (url[0] == '/') {
					res += tarsier.http.trimURI(domain + url);
				} else {
					res += tarsier.http.trimURI(path + url);
				}
			}
			res += html.substr(p2);
			return res;
		}
	
		var path = tarsier.http.parseURI(url).path;
		var domain = url.substr(0, url.indexOf(path));
		
		html = standardize_urls(html, " href=\"", "\"", domain, path);
		html = standardize_urls(html, " src=\"", "\"", domain, path);
		
		this.data = html;
		this.url = url;
		return this;
	};
	
	/**
	 *  Get all keys in the template
	 */
	tarsier.Template.prototype.keys = function() {
		var keys = [];
		var key;
		var p1, p2 = 0;
		while ((p1 = this.data.indexOf("${", p2)) > 0) {
			p1 += 2;
			p2 = this.data.indexOf("}", p1);
			if (p2 < p1) break;
			key = this.data.substr(p1, p2 - p1);
			p2 += 1;
			// check key
			for (var i = 0; i < keys.length; ++i) {
				if (keys[i] == key) break;
			}
			keys[i] = key;
		}
		return keys;
	};
	
	/**
	 *  Replace the template's key string with value
	 */
	tarsier.Template.prototype.replace = function(key, value) {
		var pos;
		key = "${" + key + "}";
		while ((pos = this.data.indexOf(key)) >= 0) {
			this.data = this.data.substr(0, pos) + value + this.data.substr(pos + key.length);
		}
		return this.data;
	};
	
	/**
	 *  Apply css and js
	 */
	function applyHead(data, document) {
		var p1, p2;
		
		// import style sheets
		p2 = 0;
		while ((p1 = data.indexOf("<link ", p2)) > 0) {
			p1 += 6;
			p2 = data.indexOf(" href=\"", p1);
			if (p2 < p1) break; // error
			p2 += 7;
			
			p1 = data.indexOf("\"", p2);
			if (p1 < p2) break; // error
			
			tarsier.importCSS({href: data.substr(p2, p1 - p2), document: document});
			p2 = p1 + 1;
		}
		
		// import scripts
		p2 = 0;
		while ((p1 = data.indexOf("<script ", p2)) > 0) {
			p1 += 8;
			p2 = data.indexOf(" src=\"", p1);
			if (p2 < p1) break; // error
			p2 += 6;
			
			p1 = data.indexOf("\"", p2);
			if (p1 < p2) break; // error
			
			tarsier.importJS({src: data.substr(p2, p1 - p2), document: document});
			p2 = p1 + 1;
		}
	};
	
	/**
	 *  Apply page with template
	 */
	tarsier.Template.prototype.apply = function(document) {
		
		// replace keys
		var keys = this.keys();
		for (var i = keys.length; i >= 0; --i) {
			this.replace(keys[i], $(document).find(keys[i]).html());
		}
		
		var p1, p2;
		
		// process head
		p1 = this.data.indexOf("<head");
		if (p1 > 0) {
			p2 = this.data.indexOf("</head>");
			if (p2 > 0) {
				applyHead(this.data.substr(p1, p2 + 7 - p1), document);
			}
		}
		
		// process body
		p1 = this.data.indexOf("<body");
		if (p1 > 0) {
			p2 = this.data.lastIndexOf("</body>");
			if (p2 > 0) {
				$(document.body).html(this.data.substr(p1, p2 + 7 - p1));
			}
		}
	};
	
})(tarsier);
