(function (window) {
	/*
	 * Date Format 1.2.3
	 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
	 * MIT license
	 *
	 * Includes enhancements by Scott Trenda <scott.trenda.net>
	 * and Kris Kowal <cixar.com/~kris.kowal/>
	 *
	 * Accepts a date, a mask, or a date and a mask.
	 * Returns a formatted version of the given date.
	 * The date defaults to the current date/time.
	 * The mask defaults to dateFormat.masks.default.
	 */
	var dateFormat = function () {
		var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
			timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
			timezoneClip = /[^-+\dA-Z]/g,
			pad = function (val, len) {
				val = String(val);
				len = len || 2;
				while (val.length < len) val = "0" + val;
				return val;
			};
		
		// Regexes and supporting functions are cached through closure
		return function (date, mask, utc) {
			var dF = dateFormat;
			
			// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
			if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
				mask = date;
				date = undefined;
			}
			
			// Passing date through Date applies Date.parse, if necessary
			date = date ? new Date(date) : new Date;
			if (isNaN(date)) throw SyntaxError("invalid date");
			
			mask = String(dF.masks[mask] || mask || dF.masks["default"]);
			
			// Allow setting the utc argument via the mask
			if (mask.slice(0, 4) == "UTC:") {
				mask = mask.slice(4);
				utc = true;
			}
			
			var	_ = utc ? "getUTC" : "get",
				d = date[_ + "Date"](),
				D = date[_ + "Day"](),
				m = date[_ + "Month"](),
				y = date[_ + "FullYear"](),
				H = date[_ + "Hours"](),
				M = date[_ + "Minutes"](),
				s = date[_ + "Seconds"](),
				L = date[_ + "Milliseconds"](),
				o = utc ? 0 : date.getTimezoneOffset(),
				flags = {
					d:    d,
					dd:   pad(d),
					ddd:  dF.i18n.dayNames[D],
					dddd: dF.i18n.dayNames[D + 7],
					m:    m + 1,
					mm:   pad(m + 1),
					mmm:  dF.i18n.monthNames[m],
					mmmm: dF.i18n.monthNames[m + 12],
					yy:   String(y).slice(2),
					yyyy: y,
					h:    H % 12 || 12,
					hh:   pad(H % 12 || 12),
					H:    H,
					HH:   pad(H),
					M:    M,
					MM:   pad(M),
					s:    s,
					ss:   pad(s),
					l:    pad(L, 3),
					L:    pad(L > 99 ? Math.round(L / 10) : L),
					t:    H < 12 ? "a"  : "p",
					tt:   H < 12 ? "am" : "pm",
					T:    H < 12 ? "A"  : "P",
					TT:   H < 12 ? "AM" : "PM",
					Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
					o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
					S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
				};
			
			return mask.replace(token, function ($0) {
				return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
		};
	}();
	
	// Some common format strings
	dateFormat.masks = {
		"default":      "mmm dd, yyyy h:MMtt",
		original:       "ddd mmm dd yyyy HH:MM:ss",
		shortDate:      "m/d/yy",
		mediumDate:     "mmm d, yyyy",
		longDate:       "mmmm d, yyyy",
		fullDate:       "dddd, mmmm d, yyyy",
		shortTime:      "h:MM TT",
		mediumTime:     "h:MM:ss TT",
		longTime:       "h:MM:ss TT Z",
		isoDate:        "yyyy-mm-dd",
		isoTime:        "HH:MM:ss",
		isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
		isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
	};
	
	// Internationalization strings
	dateFormat.i18n = {
		dayNames: [
			"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
			"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
		],
		monthNames: [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
			"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		]
	};
	
	DateUtil = {
		/**
		 * Return a javascript Date object constructed from the given
		 * date-time string formatted like: YYYY-MM-DD HH:MM:SS
		 * 
		 * @param string date_time
		 * 
		 * @return Date
		 */
		fromDateTime : function (date_time) {
			if (!date_time || date_time.length != 19) {
				return new Date('gibberish');
			}
			
			var d = new Date();
			d.setYear(parseInt(date_time.substr(0, 4) * 1));
			d.setMonth(parseInt(date_time.substr(5, 2) * 1) - 1);
			d.setDate(parseInt(date_time.substr(8, 2) * 1));
			d.setHours(parseInt(date_time.substr(11, 2) * 1));
			d.setMinutes(parseInt(date_time.substr(14, 2) * 1));
			d.setSeconds(parseInt(date_time.substr(17, 2) * 1));
			return d;
		},
		
		/**
		 * Return a datetime formatted string from the given date.
		 * 
		 * @param Date d
		 * 
		 * @return string Format: YYYY-MM-DD HH:MM:SS
		 */
		toDateTime : function (d) {
			if (isNaN(d.getTime())) {
				return '';
			}
			
			return d.getFullYear() + '-'
				+ this.zeroCheck(d.getMonth() + 1) + '-'
				+ this.zeroCheck(d.getDate()) + ' '
				+ this.zeroCheck(d.getHours()) + ':'
				+ this.zeroCheck(d.getMinutes()) + ':'
				+ this.zeroCheck(d.getSeconds());
		},
		
		/**
		 * Format a number into a string representing the amount of time until
		 * given number of seconds. Eg:
		 * - 5 seconds
		 * - 20 minutes
		 * - 1 hour
		 * 
		 * @return string
		 */
		ezDate : function (seconds) {
			var val, str;
			
			if (seconds > 86400) {
				val = Math.ceil(seconds / 86400)
				str = val + ' day';
			}
			else if (seconds > 3600) {
				val = Math.ceil(seconds / 3600)
				str = val + ' hour';
			}
			else if (seconds > 60) {
				val = Math.ceil(seconds / 60)
				str = val + ' minute';
			}
			else {
				val = seconds;
				str = seconds + ' second';
			}
			str += ((1 == val)) ? '' : 's';
			
			return str;
		},
		
		/**
		 * Ensure requested value has a leading '0' if the value is < 10.
		 * 
		 * @param integer val
		 * 
		 * @return string
		 */
		zeroCheck : function (val) {
			val = parseInt(val);
			if (val < 10) {
				val = '0' + val;
			}
			else {
				val = val.toString();
			}
			return val;
		},
		
		format : function (date, mask, utc) {
			return dateFormat(date, mask, utc);
		},
		
		formatStr : function (date_str, mask, utc) {
			return this.format(this.fromDateTime(date_str), mask, utc);
		}
	};
	
	window.DateUtil = DateUtil;
})(window);
