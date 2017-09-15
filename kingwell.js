/**
 * Name   : Utisl
 * Author : kingwell leng;
 * Date   : 20174-09-15
 * Home   : https://github.com/lengjh
 */
;
(function(window, undefined) {
	'use strict';



	function _U() {}
	_U.prototype = {
		getString: function(num) {
			var result = [];
			var len = Math.ceil((undefined !== num ? num : 32) / 12);
			for (var i = 0; i < len; i++) {
				result.push(Math.random().toString(36).slice(2));
			};
			return result.join('').slice(0, num);
		},
		getRange: function(start, end) {
			return Math.round(Math.random() * (end - start)) + start;
		},
		getTimes: function() {
			return new Date().getTime();
		},
		getQueryValue: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = top.location.search.substr(1).match(reg);
			if (r !== null) {
				return unescape(r[2]);
			}
			return null;
		},
		forEach: function(object, callback) {
			var list;
			var templ;
			if (_is.isArray(object)) {
				list = [];
				for (var i = 0; i < object.length; i++) {
					var templ = callback(object[i], i, object);
					if (undefined !== templ) {
						list.push(templ);
					}

				}
			} else {
				for (var key in object) {
					list = {};
					templ = callback(object[key], key, object);
					if (undefined !== templ) {
						list[key] = templ;
					}
				}
			}
			return list;
		}
	};
	var _u = new _U();

	function _Time() {}
	_Time.prototype = {
		__colors: ['#000', 'green', 'blue', 'orange', 'red'],
		start: function(id, keep) {
			id = undefined === id ? '__time__' : id;
			this.time = this.time || {};
			this.time[id] = new Date().getTime();
			this.time[id + 'keep'] = keep === true ? true : false;
		},
		end: function(id, isMs) {
			var result;
			var val = 0;
			var color = 0;
			var _unit = isMs === true ? 1000 : 1;
			id = undefined === id ? '__time__' : id;
			if (undefined === id || undefined === this.time[id]) {
				result = 0; //throw '未找到相应ID';
				return;
			}
			val = (new Date().getTime() - this.time[id]) / _unit;
			result = '【' + id + '执行时间】➤ ' + val + (isMs === true ? 's' : 'ms') + '';
			if (!this.time[id + 'keep']) {
				delete this.time[id];
			}
			if (val < 500) {
				color = 0;
			} else if (val >= 500 && val < 1000) {
				color = 1;
			} else if (val >= 1000 && val < 1500) {
				color = 2;
			} else if (val >= 1500 && val < 2000) {
				color = 3;
			} else if (val >= 2000) {
				color = 4;
			}
			try {
				console.log('%c' + result, 'color:' + this.__colors[color] + '; font-family:Microsoft YaHei');
			} catch (ev) {}
			return result;
		}
	};
	var _time = new _Time();

	function _DEV() {
		this.init();
	}
	_DEV.prototype = {
		debug: false,
		log: function() {
			try {
				console.log.apply(console, arguments);
			} catch (ev) {}
		},
		time: _time
	};


	function _Is() {}
	_Is.prototype = {
		__is: function(object, type) {
			return Object.prototype.toString.call(object).slice(8, -1) === type;
		},
		isArray: function(object) {
			return this.__is(object, 'Array');
		},
		isFunction: function(object) {
			return this.__is(object, 'Function');
		},
		isObject: function(object) {
			return this.__is(object, 'Object');
		},
		isString: function(object) {
			return this.__is(object, 'String');
		},
		isNumber: function(object) {
			return this.__is(object, 'Number');
		},
		isDate: function(object) {
			return this.__is(object, 'Date');
		}
	};

	var _is = new _Is();

	function _Fn() {};
	_Fn.prototype = {

		/**
		 * 深度复制
		 * @param  {Object Or Other type} source [source object]
		 * @return {Object}        [new object]
		 */
		deepCopy: function(source) {
			var newObject = {};
			if (typeof source !== 'object') {
				newObject = source;
			} else {
				for (var key in source) {
					newObject[key] = Object.prototype.toString.call(source[key]) === '[object Array]' ? [] : {};
					newObject[key] = this.deepCopy(source[key]);
				}
			}
			return newObject;
		},

		/**
		 * [assign description]
		 * @return {[type]} [description]
		 */
		assign: function() {
			var newObject = {};
			for (var i = 0, len = arguments.length; i < len; i++) {
				var obj = arguments[i];
				for (var key in obj) {
					if (undefined !== obj[key]) {
						newObject[key] = this.deepCopy(obj[key]);
					}
				}
			}
			return newObject;
		},


		extend: function(Child, Parent) {
			var F = function() {};
			var obj;
			if (arguments.length !== 2) {
				//throw 'Missing build function.';
				throw Error('Missing build function.')
			}
			F.prototype = Parent.prototype;　
			obj = new F();
			for (var key in obj) {
				if (undefined === Child.prototype[key]) {
					Child.prototype[key] = obj[key];
				}
			}　　　　　　　　
			Child.uber = Parent.prototype;
			return Child;
		},

		create: function() {
			var F = function() {};
			F.prototype = this.assign.apply(this, arguments);
			return new F;
		},

		keys: function() {
			var keys = [];
			for (var i = 0, len = arguments.length; i < len; i++) {
				for (var key in arguments[i]) {
					keys.push(key);
				}
			}
			keys.sort(function(a, b) {
				return a > b;
			});
			return keys;
		},

		inArray: function(item, arr, boolean) {
			var index = -1;
			if (!this.isArray(arr) || arguments.length < 2) {
				return;
			}
			for (var i = 0, len = arr.length; i < len; i++) {
				if (arr[i] === item) {
					index = i;
				}
			}
			if (true === boolean) {
				index = index === -1 ? false : true;
			}
			return index;
		},

		normal: function(object) {
			var newObject = {};
			if (Object.prototype.toString.call(object) === '[object Array]') {
				newObject = [];
				for (var i = 0, len = object.length; i < len; i++) {
					if (undefined !== object[i]) {
						newObject.push(object[i]);
					}
				}
			} else {
				for (var key in object) {
					if (undefined !== object[key]) {
						newObject[key] = object[key];
					}
				}
			}
			return newObject;
		},

		delDuplicate: function(arr) {
			var result = [];
			for (var i = 0; i < arr.length; i++) {
				var status = true;
				for (var j = 0; j < i; j++) {
					if (arr[i] === arr[j]) {
						status = false;
					}
				}
				if (status) {
					result.push(arr[i]);
				}
			}
			return result;
		}
	};

	var _fn = new _Fn();

	var $_$ = function() {
		this.init();
	};
	$_$.prototype = {
		init: function() {
			try {
				if (localStorage.getItem('dev') === 'true') {
					this.debug = true;
				}
			} catch (ev) {}
			if (this.getQueryValue('dev') === 'true') {
				this.debug = true;
			}
			if (this.debug) {
				this.log('%cDEV MODE', 'color:#f00;height:100px; line-height:100px; font-size:100px; padding:10px;text-shadow:1px 1px 0 gray,2px 2px 0 gray,3px 3px 0 gray;,4px 4px 0 gray;');
			}

		},
		constructor: $_$,
		name: ''
	};
	_fn.extend($_$, _DEV);
	_fn.extend($_$, _Fn);
	_fn.extend($_$, _Is);
	_fn.extend($_$, _U);


	window.__ = new $_$();

})(this);
