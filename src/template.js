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
 *  Processing templates
 *
 *  Author: moKy @ Dec. 11, 2013
 *
 */

!function(tarsier) {

	// class: Template
	var Template = function(html, url) {
		if (this.init(html, url)) {
			//
		}
		return this;
	};
	
	/**
	 *  Repalce all "src" and "href" string to absulute URLs
	 */
	var init = function(html, url) {
		
		function standardize_urls(text, start, end, domain, path) {
			var res = "";
			
			var p1, p2 = 0;
			var url;
			
			while ((p1 = html.indexOf(start, p2)) > 0) {
				p1 += start.length;
				res += html.substring(p2, p1);
				
				p2 = html.indexOf(end, p1);
				if (p2 < p1) {
					p2 = p1;
					break; // error
				}
				if (p2 === p1) continue; // blank url
				
				url = html.substring(p1, p2);
				if (url.indexOf("://") > 0) {
					res += tarsier.uri.trim(url);
				} else if (url[0] === '/') {
					res += tarsier.uri.trim(domain + url);
				} else {
					res += tarsier.uri.trim(path + url);
				}
			}
			res += html.substring(p2);
			return res;
		}
		
		if (url) {
			// process base url
			var path = tarsier.uri.parse(url).path;
			var domain = url.substring(0, url.indexOf(path));
			
			html = standardize_urls(html, " href=\"", "\"", domain, path);
			html = standardize_urls(html, " src=\"", "\"", domain, path);
		}
		
		this.data = html;
		this.url = url;
		return this;
	};
	
	/**
	 *  Get all keys in the template
	 */
	var getKeys = function() {
		var keys = [];
		var key;
		var p1, p2 = 0;
		while ((p1 = this.data.indexOf("${", p2)) > 0) {
			p1 += 2;
			p2 = this.data.indexOf("}", p1);
			if (p2 < p1) break;
			key = this.data.substring(p1, p2);
			p2 += 1;
			// check key
			for (var i = 0; i < keys.length; ++i) {
				if (keys[i] === key) break;
			}
			keys[i] = key;
		}
		return keys;
	};
	
	/**
	 *  Replace the template's key string with value
	 */
	var replace = function(key, value) {
		var re = new RegExp("\\$\\{" + key + "\\}", "g");
		this.data = this.data.replace(re, value);
		return this;
	};
	
	/**
	 *  Replace all keys with document
	 */
	var replaceAll = function(document) {
		var keys = this.keys();
		document = $(document); // jquery object
		// replace all keys
		for (var i = 0; i < keys.length; ++i) {
			this.replace(keys[i], document.find(keys[i]).html());
		}
		return this;
	};
	
	/**
	 *  Apply css and js
	 */
	var applyHead = function(data, document) {
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
			
			tarsier.importCSS(data.substring(p2, p1));
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
			
			tarsier.importJS(data.substring(p2, p1));
			p2 = p1 + 1;
		}
	};
	
	/**
	 *  Apply page with template
	 */
	var apply = function(document) {
		
		// replace all keys first
		this.replaceAll(document);
		
		var p1, p2 = 0;
		
		// first, process head
		p1 = this.data.indexOf("<head", p2);
		if (p1 > 0) {
			p2 = p1 + 5;
			p1 = this.data.indexOf(">", p2) + 1;
			
			p2 = this.data.indexOf("</head>", p1);
			if (p2 > 0) {
				applyHead(this.data.substring(p1, p2), document);
			}
		}
		
		// second, process body
		p1 = this.data.indexOf("<body", p2);
		if (p1 > 0) {
			p2 = p1 + 5;
			p1 = this.data.indexOf(">", p2) + 1;
			
			p2 = this.data.lastIndexOf("</body>");
			if (p2 > 0) {
				$(document.body).html(this.data.substring(p1, p2));
			}
		}
		
		return this;
	};
	
	tarsier.Template = Template;
	
	tarsier.Template.prototype.init = init;
	tarsier.Template.prototype.keys = getKeys;
	tarsier.Template.prototype.replace = replace;
	tarsier.Template.prototype.replaceAll = replaceAll;
	tarsier.Template.prototype.apply = apply;
	
}(tarsier);
