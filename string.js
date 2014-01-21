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
 *  String utilities
 *
 *  Author: moKy @ Jan. 14, 2014
 *
 */

(function(tarsier) {

	function alert(message) {
		message = "[Tarsier] string.js > " + message;
		if (typeof(tarsier.log) === "function") {
			tarsier.log(message);
		} else {
			window.alert(message);
		}
	}
	
	function lowercase(str) {
		for (var i = str.length - 1; i >= 0; --i) {
			str[0] = str[0].toLowerCase();
		}
		return str;
	}
	// standard key? short key?
	function _sk(str) {
		return lowercase(str.replace(/\-/g, ""));
	}
	
	//
	// convertor
	//
	var _convertors = []; // key: 'from -> to'
	
	// key
	tarsier.convertorKey = function(from, to) {
		return _sk(from) + " -> " + _sk(to);
	};
	// getter
	tarsier.convertor = function(from, to) {
		var key = this.convertorKey(from, to);
		return _convertors[key];
	};
	// setter
	tarsier.setConvertor = function(from, to, convertor) {
		var key = this.convertorKey(from, to);
		_convertors[key] = convertor;
	};
	// conv
	tarsier.convert = function(from, to, data) {
		// same charsets
		if (from === to) {
			return data;
		}
		// 1. convert directly
		var conv = this.convertor(from, to);
		if (conv) {
			return conv(data);
		}
		// 2. convert via 'utf-8'
		var conv1 = this.convertor(from, "utf-8");
		var conv2 = this.convertor("utf-8", to);
		if (conv1 && conv2) {
			return conv2(conv1(data));
		}
		// sorry....
		alert("unsupported charsets converting (" + from + " -> " + to + ")");
		return data;
	};
	
	//
	// en/decoder
	//
	var _encoders = [];
	var _decoders = [];
	
	// getter
	tarsier.encoder = function(name) {
		return _encoders[_sk(name)];
	};
	tarsier.decoder = function(name) {
		return _decoders[_sk(name)];
	};
	// setter
	tarsier.setEncoder = function(name, encoder) {
		_encoders[_sk(name)] = encoder;
	};
	tarsier.setDecoder = function(name, decoder) {
		_decoders[_sk(name)] = decoder;
	};
	// encode
	tarsier.encode = function(name, data) {
		var func = this.encoder(name);
		if (func) {
			return func(data);
		}
		alert("unsupported encoder: " + name);
		return data;
	};
	// decode
	tarsier.decode = function(name, data) {
		var func = this.decode(name);
		if (func) {
			return func(data);
		}
		alert("unsupported decoder: " + name);
		return data;
	};
	
	//--------------------------------------------------------------------------
	
	// class: String
	tarsier.String = function(string, charset) {
		this.charset = charset || "utf-16";
		this.data = string;
		return this;
	};
	
	// converting string from 'this.charset' to 'charset'
	tarsier.String.prototype.convertTo = function(charset) {
		return tarsier.convert(this.charset, charset, this.data);
	};
	
//	// encode
//	tarsier.String.prototype.encode = function(name) {
//		var encode = tarsier.encoder(name);
//		if (encode) {
//			this.data = encode(this.data);
//			this.charset = name;
//		} else {
//			alert("unsupported encoder: " + name);
//		}
//		return this.data;
//	};
//	// decode
//	tarsier.String.prototype.decode = function(name) {
//		var decode = tarsier.decoder(name);
//		if (decode) {
//			this.data = decode(this.data);
//			//this.charset = "utf-16";
//		} else {
//			alert("unsupported decoder: " + name);
//		}
//		return this.data;
//	};
	
})(tarsier);
