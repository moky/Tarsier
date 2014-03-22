;
/*!
 * Tarsier JavaScript Library v1.1.0
 * http://github.com/moky/Tarsier/
 *
 * Includes jquery.js
 * http://jquery.com/
 * Includes jquery.xml2json.js
 * http://jquery-xml2json-plugin.googlecode.com/
 *
 * Copyright 2014 moKy at slanissue.com
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-03-22 T14:00Z
 */

/**
 *
 *  do some special math
 *
 *  Author: moKy @ Mar. 22, 2014
 *
 */

!function(tarsier) {
	
	//------------------------------------------------------------- memory cache
	// cache pool
	var _pool = {
		
	};
	// cache key
	var _key = function(x, y) {
		return x + '**' + y;
	};
	
	var push_cache = function(x, y, result) {
		_pool[_key(x, y)] = result.copy(); // save a copy of the big integer
	};
	
	var get_cache = function(x, y) {
		return _pool[_key(x, y)];
	};
	
	//-------------------------------------------------------------- calculating
	var step = function(x, y, i, fx, callback) {
		if (i >= y) {
			// mission accomplished
			return fx;
		}
		
		var t = y - i;
		var tx = null;
		
		if (t >= i) {
			// still far away, double it
			t = i;
			tx = fx; // x ^ i
		} else {
			// nearby, get the largest one
			while (t > 0) {
				tx = get_cache(x, t); // x ^ t
				if (tx) {
					if (callback) callback(x, t, fx, true);
					break;
				}
				--t;
			}
			// assert(tx != null, "It's impossible!");
		}
		
		var dx = get_cache(x, i + t); // x ^ (i+t)
		if (dx) {
			fx = dx; // cache value
			if (callback) callback(x, i + t, fx, true);
		} else {
			fx.multiply_assign(tx); // fx *= tx, (fx = x ^ i, tx = x ^ t)
			if (callback) callback(x, i + t, fx, false);
			push_cache(x, i + t, fx);
		}
		
		if (callback) {
			// asynchronized
			setTimeout(function() { step(x, y, i + t, fx, callback); }, 1);
		} else {
			return step(x, y, i + t, fx);
		}
	};
	
	// if 'callback(x, y, result, cache)' is set, it will be call asynchronized
	var pow = function(x, y, callback) {
		var fx = get_cache(x, 1); // x ^ 1 from cache
		if (fx) {
			if (callback) callback(x, 1, fx, true);
		} else {
			fx = tarsier.Integer.create(x); // big integer
			if (callback) callback(x, 1, fx, false);
			push_cache(x, 1, fx);
		}
		
		if (callback) {
			// asynchronized
			setTimeout(function() { step(x, y, 1, fx, callback); }, 1);
		} else {
			return step(x, y, 1, fx);
		}
	};
	
	//--------------------------------------------------------------------------
	
	tarsier.Math = {
		pow: pow,
	};
	
}(tarsier);
