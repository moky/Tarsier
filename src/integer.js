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
 * Date: 2014-03-21 T11:02Z
 */

/**
 *
 *  Processing XML
 *
 *  Author: moKy @ Mar. 21, 2014
 *
 */

!function(tarsier) {
	
	//var UNIT_MAX = 0x100000000; // 32 bits
	var UNIT_MAX = 1000;//1000*1000*1000; // 10^9 < (2^32 = 4,294,967,296)
	
	var Integer = function() {
		this.data = null;
		this.negative = false;
	};
	
	var length = function() {
		return this.data ? this.data.length : 0;
	};
	
	var resize = function(size) {
		if (arguments.length === 0) {
			size = 0;
		}
		
		var data = this.data;
		var len = length.call(this);
		
		if (size === 0 && len > 0) {
			// detect empty spaces
			size = len;
			var mid;
			while (size > 1) {
				mid = size / 2;
				for (var i = mid; i < size; ++i) {
					if (data[i]) {
						mid = -1;
						break;
					}
				}
				
				if (mid < 1) {
					break;
				}
				size = mid;
			}
		} else if (size <= len) {
			// ignore this operation
			return false;
		}
		
		if (size < 1 || size == len) {
			// ignore this operation
			return false;
		}
		
		if (!data) {
			data = [];
			for (var i = 0; i < size; ++i) {
				data[i] = 0;
			}
			this.data = data;
		} else if (size > len) {
			for (var i = len; i < size; ++i) {
				data[i] = 0;
			}
		} else if (size < len) {
			data.splice(size, len - size);
		}
		
		return true;
	};
	
	var expand = function() {
		return resize.call(this, length.call(this) * 2);
	};
	
	var init = function(size) {
		if (arguments.length == 0) {
			size = 1;
		}
		
		this.data = null;
		this.negative = false;
		
		return resize.call(this, size);
	};
	
	var create = function(other) {
		var res = new Integer();
		
		if (other instanceof Integer) {
			if (init.call(res, length.call(other))) {
				assign.call(res, other);
			}
		} else {
			// base type: treat it as a string
			if (!other) other = '0';
			other = other.toString();
			var neg = other[0] == '-';
			
			// cut the tail
			var i = other[0] == '-' || other[0] == '+' ? 1 : 0;
			for (; i < other.length; ++i) {
				if (other[i] < '0' || other[i] > '9') {
					break;
				}
			}
			other = other.substring(0, i);
			
			var N = 3;
			var count = Math.ceil(other.length / N);
			var size = 1;
			while (size < count) {
				size += size;
			}
			
			if (init.call(res, size)) {
				for (var i = 0; i < size; ++i) {
					var pos = other.length - N - i * N;
					if (pos <= 0) {
						res.data[i] = parseInt(other.substring(0, pos + 3));
						break;
					} else {
						res.data[i] = parseInt(other.substring(pos, pos + 3));
					}
				}
				res.negative = neg;
			}
		}
		
		return res;
	};
	
	var ONE = create(1);
	var NEG_ONE = create(-1);
	var ZERO = create(0);
	
	var copy = function() {
		return create(this);
	};
	
	var description = function() {
		var len = length.call(this);
		var string = stringValue.call(this);
		return "&lt;Integer|Len:" + len + "&gt; " + string;
	};
	
	var stringValue = function(separator) {
		if (arguments.length === 0) {
			separator = ',';
		}
		
		var N = 3; // numbers contain in each data item
		
		var data = this.data;
		var len = length.call(this);
		
		var string = '';
		var i;
		
		// concat items into a string
		for (i = len - 1; i >= 0; --i) {
			var s = data[i].toString();
			for (var j = s.length; j < N; ++j) {
				s = '0' + s;
			}
			string += separator + s;
		}
		
		// trim
		for (i = 0; i < string.length; ++i) {
			if (string[i] != '0' && string[i] != ',') {
				break;
			}
		}
		if (i > 0) {
			string = string.substring(i - 1);
		}
		
		return this.negative ? '-' + string.substring(1) : string.substring(1);
	};
	
	var integerValue = function() {
		var value = 0;
		if (this.data) {
			var len = length.call(this);
			if (len > 3) {
				len = 3; // (1000*1000*1000 = 10^9) < (2^32 = 4,294,967,296)
			}
			for (var i = len - 1; i >= 0; --i) {
				value = value * UNIT_MAX + this.data[i];
			}
		}
		return this.negative ? -value : value;
	};
	
	var isZero = function() {
		var len = length.call(this);
		for (var i = 0; i < len; ++i) {
			if (this.data[i]) {
				return false;
			}
		}
		return true;
	};
	
	/**
	 *  returns:
	 *      -1, a < b
	 *       0, a == b
	 *       1, a > b
	 */
	var compare_two = function(a, b) {
		// pre-check: ZERO?
		if (isZero.call(a)) {
			if (isZero.call(b)) {
				return 0; // 0 == 0
			}
			return b.negative ? 1 : -1; // 0 <=> b
		} else if (isZero.call(b)) {
			return a.negative ? -1 : 1; // a <=> 0
		}
		
		// pre-check: negative ?
		if (a.negative && !b.negative) {
			return -1; // -a < +b
		} else if (!a.negative && b.negative) {
			return 1; // +a < -b
		}
		
		//---- from now on, a.negative == b.negative
		
		var aLen = length.call(a);
		var bLen = length.call(b);
		
		var end = bLen;
		
		// part 1
		if (aLen < bLen) {
			// case 1
			for (var i = aLen; i < bLen; ++i) {
				if (b.data[i]) {
					return a.negative ? 1 : -1; // abs(a) < abs(b)
				}
			}
			end = aLen;
		} else if (aLen > bLen) {
			// case 2
			for (var i = bLen; i < aLen; ++i) {
				if (a.data[i]) {
					return a.negative ? -1 : 1; // abs(a) > abs(b)
				}
			}
		}
		
		// part 2
		for (var i = end - 1; i >= 0; --i) {
			if (a.data[i] < b.data[i]) {
				return a.negative ? 1 : -1; // abs(a) < abs(b)
			} else if (a.data[i] > b.data[i]) {
				return a.negative ? -1 : 1; // abs(a) > abs(b)
			}
		}
		
		return 0; // a == b
	};
	
	var compare = function(other) {
		compare_two(this, other);
	};
	
	//---------------------------------------------------------------- operators
	
	// =
	var assign = function(other) {
		if (other instanceof Integer) {
		} else {
			other = create(other);
		}
		
		var len = length.call(other);
		if (init.call(this, len)) {
			for (var i = 0; i < len; ++i) {
				this.data[i] = other.data[i];
			}
			this.negative = other.negative;
		}
	};
	
	// +
	var plus = function(other) {
		var res = new Integer();
		assign.call(res, this); // res = this;
		plus_assign.call(res, other); // res += other;
		return res;
	};
	
	// -
	var minus = function(other) {
		var res = new Integer();
		assign.call(res, this); // res = this;
		minus_assign.call(res, other); // res -= other;
		return res;
	};
	
	// *
	var multiply = function(other) {
		var res = new Integer();
		assign.call(res, this); // res = this;
		multiply_assign.call(res, other); // res *= other;
		return res;
	};
	
	// +=
	var plus_assign = function(other) {
		if (other instanceof Integer) {
		} else {
			other = create(other);
		}
		
		while (length.call(this) < length.call(other)) {
			expand.call(this);
		}
		
		var sum = 0;
		var overflow = 0;
		
		var aLen = length.call(this);
		var bLen = length.call(other);
		
		// part 1
		var i = 0;
		for (; i < bLen; ++i) {
			sum = this.data[i] + overflow;
			
			if (this.negative == other.negative) {
				sum += other.data[i];
			} else {
				sum -= other.data[i];
			}
			
			if (sum < 0) {
				overflow = -1;
				this.data[i] = sum + UNIT_MAX;
			} else if (sum < UNIT_MAX) {
				overflow = 0;
				this.data[i] = sum;
			} else {
				overflow = 1;
				this.data[i] = sum - UNIT_MAX;
			}
		}
		
		// part 2
		if (overflow != 0) {
			for (; i < aLen; ++i) {
				sum = this.data[i] + overflow;
				
				if (sum < 0) {
					overflow = -1;
					this.data[i] = sum + UNIT_MAX;
				} else if (sum < UNIT_MAX) {
					overflow = 0;
					this.data[i] = sum;
					break;
				} else {
					overflow = 1;
					this.data[i] = sum - UNIT_MAX;
				}
			}
		}
		
		// part 3
		if (overflow > 0) {
			expand.call(this);
			this.data[i] = overflow;
		} else if (overflow < 0) {
			var flag = this.negative;
			this.negative = false;
			
			var g = new Integer();
			init.call(g, aLen * 2);
			
			g.data[aLen] = 1; // set value:  0x100000000...00000000
			minus_assign.call(g, this);
			g.negative = !flag;
			
			resize.call(g);
			assign.call(this, g);
		}
		
		return this;
	};
	
	// -=
	var minus_assign = function(other) {
		/**
		 *    a - b <=> -(-a + b)
		 */
		this.negative = !this.negative;
		plus_assign.call(this, other);
		this.negative = !this.negative;
		
		return this;
	};
	
	// *=
	var multiply_assign = function(other) {
		if (other instanceof Integer) {
		} else {
			other = create(other);
		}
		
		var aLen = length.call(this);
		var bLen = length.call(other);
		var size = aLen > bLen ? aLen * 2 : bLen * 2;
		
		var product = new Integer();
		product.init(size);
		
		var pro;
		var overflow;
		
		var i, j, k;
		
		for (i = 0; i < aLen; ++i) {
			k = i;
			overflow = 0;
			for (j = 0; j < bLen; ++j, ++k) {
				pro = this.data[i] * other.data[j] + overflow + product.data[k];
				if (pro < UNIT_MAX) {
					overflow = 0;
					product.data[k] = pro;
				} else {
					overflow = Math.floor(pro / UNIT_MAX);
					product.data[k] = pro - overflow * UNIT_MAX;
				}
			}
			if (overflow) {
				if (i >= aLen - 1) {
					// out of memory
					expand.call(product);
				}
				product.data[k] = overflow;
			}
		}
		
		resize.call(product);
		assign.call(this, product);
		
		this.negative = this.negative != other.negative;
		return this;
	};
	
	// ++
	var plus_plus = function() {
		plus_assign.call(this, ONE);
		return this;
	};
	
	// --
	var minus_minus = function() {
		plus_assign.call(this, NEG_ONE);
		return this;
	};
	
	// ==
	var equalsTo = function(other) {
		return compare_two(this, other) == 0;
	};
	
	// <
	var smallThan = function(other) {
		return compare_two(this, other) < 0;
	};
	
	// >
	var largeThan = function(other) {
		return compare_two(this, other) > 0;
	};
	
	// <=
	var smallEqualsTo = function(other) {
		return compare_two(this, other) <= 0;
	};
	
	var largeEqualsTo = function(other) {
		return compare_two(this, other) >= 0;
	};
	
	var notEqualsTo = function(other) {
		return compare_two(this, other) != 0;
	};
	
	//--------------------------------------------------------------------------
	
	// static functions
	Integer.create = create;
	
	// instance functions
	Integer.prototype.init = init;
//	Integer.prototype.resize = resize;
//	Integer.prototype.length = length;
//	Integer.prototype.expand = expand;
	Integer.prototype.copy = copy;
	Integer.prototype.description = description;
	Integer.prototype.stringValue = stringValue;
	Integer.prototype.integerValue = integerValue;
	Integer.prototype.isZero = isZero;
	
	Integer.prototype.assign = assign;
	Integer.prototype.plus = plus;
	Integer.prototype.minus = minus;
	Integer.prototype.multiply = multiply;
	Integer.prototype.plus_assign = plus_assign;
	Integer.prototype.minus_assign = minus_assign;
	Integer.prototype.multiply_assign = multiply_assign;
	Integer.prototype.plus_plus = plus_plus;
	Integer.prototype.minus_minus = minus_minus;
	Integer.prototype.equalsTo = equalsTo;
	Integer.prototype.smallThan = smallThan;
	Integer.prototype.largeThan = largeThan;
	Integer.prototype.smallEqualsTo = smallEqualsTo;
	Integer.prototype.largeEqualsTo = largeEqualsTo;
	Integer.prototype.notEqualsTo = notEqualsTo;
	
	tarsier.Integer = Integer;
	
}(tarsier);
