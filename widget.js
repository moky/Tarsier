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
 *  Processing widgets
 *
 *  Author: moKy @ Nov.11, 2013
 *
 */

(function(tarsier) {
	
	// current widgets(use target as key)
	tarsier.widgets = {};
	
	// class: Widget
	tarsier.Widget = function(target) {
		this.target = target;
		this.template = null;
		this.data = null;
		
		tarsier.widgets[target] = this;
		return this;
	};
	
	tarsier.Widget.prototype.query = function(template, datasource) {
		var target = this.target;
		if (!target) return;
		// query template
		tarsier.http.ajax({
						  url: template,
						  dataType: "html",
						  //cache: false,
						  success: function(html) {
							var wgt = tarsier.widgets[target];
							if (wgt) {
								wgt.template = html;
								wgt.show(target);
							}
						  },
						  error: function() { alert("Error loading template: " + template); }
		});
		// query data
		tarsier.http.ajax({
						  url: datasource,
						  dataType: "xml",
						  //cache: false,
						  success: function(xml) {
							var wgt = tarsier.widgets[target];
							if (wgt) {
								wgt.data = (new tarsier.XML(xml)).json();
								wgt.show(target);
							}
						  },
						  error: function() { alert("Error loading data: " + datasource); }
		});
	}
	
	tarsier.Widget.prototype.show = function(target) {
		if (!this.template || !this.data) return;
		if (!target) {
			if (!this.target) return;
			target = this.target;
		}
		
		$.template(target, this.template);
		$.tmpl(target, this.data).appendTo(target);
	}
	
})(tarsier);
