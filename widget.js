;
/*!
 * Tarsier JavaScript Library v1.0.1
 * http://github.com/moky/Tarsier/
 *
 * Includes jquery.js
 * http://jquery.com/
 * Includes jquery.tmpl.js
 * https://github.com/borismoore/jquery-tmpl/
 *
 * Copyright 2013 moKy at slanissue.com
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-12-11 T10:43Z
 */

/**
 *
 *  Processing widgets
 *
 *  Author: moKy @ Dec. 11, 2013
 *
 */

(function(tarsier) {

	function alert(message) {
		message = "[Tarsier] widget.js > " + message;
		if (typeof(tarsier.log) === "function") {
			tarsier.log(message);
		} else {
			window.alert(message);
		}
	}
	
	// all widgets(use target as key)
	tarsier.widgets = {};
	
	// class: Widget
	tarsier.Widget = function(target) {
		// where widget binded to
		this.target = target;
		// html
		this.html = null;
		// template
		this.template = null;
		this.data = null;
		
		// hook
		tarsier.widgets[target] = this;
		return this;
	};
	
	// query template from "args.url"
	tarsier.Widget.prototype.queryTemplate = function(args) {
		var target = args.target || this.target;
		if (!target) return;
		var url = args.url;
		var type = "html";
		// query template
		tarsier.http.ajax({
						  url: url,
						  dataType: type,
						  //cache: false,
						  success: function(template) {
							var wgt = tarsier.widgets[target];
							if (wgt) {
								wgt.setTemplate(template, url);
								wgt.show(); // try to show
							}
						  },
						  error: function() {
							alert("error loading template from '" + url + "'");
						  }
		});
		return this;
	};
	
	// query data from "args.url" with "args.type"
	tarsier.Widget.prototype.queryData = function(args) {
		var target = args.target || this.target;
		if (!target) return;
		var url = args.url;
		var type = args.type || "xml";
		// query data
		tarsier.http.ajax({
						  url: url,
						  dataType: type,
						  //cache: false,
						  success: function(data) {
							var wgt = tarsier.widgets[target];
							if (wgt) {
								wgt.setData(data, type, url);
								wgt.show(); // try to show
							}
						  },
						  error: function() {
							alert("error loading data from '" + url + "'");
						  }
		});
		return this;
	};
	
	// query html from "args.url"
	tarsier.Widget.prototype.queryHtml = function(args) {
		var target = args.target || this.target;
		if (!target) return;
		var url = args.url;
		var type = "html";
		// query html
		tarsier.http.ajax({
						  url: url,
						  dataType: type,
						  //cache: false,
						  success: function(html) {
							var wgt = tarsier.widgets[target];
							if (wgt) {
								wgt.setHtml(html, url);
								wgt.show(true); // try to show
							}
						  },
						  error: function() {
							alert("error loading html from '" + url + "'");
						  }
		});
		return this;
	};
	
	// query template and data
	tarsier.Widget.prototype.query = function(template, dataSource, dataType) {
		this.template = null;
		this.data = null;
		this.queryTemplate({url: template});
		this.queryData({url: dataSource, type: dataType});
		return this;
	};
	
	// load html
	tarsier.Widget.prototype.load = function(url) {
		this.html = null
		this.queryHtml({url: template});
		return this;
	};
	
	// set html
	// (override it)
	tarsier.Widget.prototype.setHtml = function(html, base_url) {
		html = (new tarsier.Template(html, base_url)).data;
		this.html = html;
		return this;
	};
	
	// set template
	// (override it)
	tarsier.Widget.prototype.setTemplate = function(template, base_url) {
		this.template = template;
		return this;
	};
	
	// set data
	// (override it)
	tarsier.Widget.prototype.setData = function(data, type, base_url) {
		if (type === "xml") {
			data = (new tarsier.XML(data)).json();
		} else if (type === "json") {
			if (typeof(data) === "string") {
				data = $.parseJSON(data);
			}
		}
		this.data = data;
		return this;
	};
	
	// show widget
	// (override it)
	tarsier.Widget.prototype.show = function(html) {
		if (this.target == null) return;
		if (html) {
			// show html
			if (this.html) {
				$(this.target).html(this.html);
			}
		} else {
			// show template
			if (this.template && this.data) {
				$(this.target).html("");
				var name = this.target;
				$.template(name, this.template);
				$.tmpl(name, this.data).appendTo(this.target);
			}
		}
		return this;
	};
	
})(tarsier);
