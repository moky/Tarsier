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
		for (var i = str.length; i >= 0; --i) {
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
	
	tarsier.convertorKey = function(from, to) {
		return _sk(from) + " -> " + _sk(to);
	}
	tarsier.convertor = function(from, to) {
		var key = this.convertorKey(from, to);
		return _convertors[key];
	}
	tarsier.setConvertor = function(from, to, convertor) {
		var key = this.convertorKey(from, to);
		_convertors[key] = convertor;
	}
	
	//
	// en/decoder
	//
	var _encoders = [];
	var _decoders = [];
	
	tarsier.encoder = function(name) {
		return _encoders[_sk(name)];
	}
	tarsier.decoder = function(name) {
		return _decoders[_sk(name)];
	}
	tarsier.setEncoder = function(name, encoder) {
		_encoders[_sk(name)] = encoder;
	}
	tarsier.setDecoder = function(name, decoder) {
		_decoders[_sk(name)] = decoder;
	}
	
	//--------------------------------------------------------------------------
	
	// class: String
	tarsier.String = function(string, charset) {
		this.charset = charset || "utf-16";
		this.data = string;
		return this;
	};
	
	// converting string from 'this.charset' to 'charset'
	tarsier.String.prototype.convertTo = function(charset) {
		if (this.charset === charset) {
			return this.data;
		}
		
		var conv = tarsier.convertor(this.charset, charset);
		if (conv) {
			return conv(this.data);
		}
		
		alert("unsupported charsets converting (" + this.charset + " -> " + charset + ")");
		return this.data;
	};
	
	// encode
	tarsier.String.prototype.encode = function(name) {
		var encode = tarsier.encoder(name);
		if (encode) {
			this.data = encode(this.data);
		} else {
			alert("unsupported encoder: " + name);
		}
		return this.data;
	}
	// decode
	tarsier.String.prototype.decode = function(name) {
		var decode = tarsier.decoder(name);
		if (decode) {
			this.data = decode(this.data);
		} else {
			alert("unsupported decoder: " + name);
		}
		return this.data;
	}
	
})(tarsier);
