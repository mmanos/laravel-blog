(function () {
	// Map over multieditor in case of overwrite.
	var _multieditor = window.multieditor;
	
	/**
	 * Multieditor class.
	 */
	var multieditor = {
		/**
		 * Registered driver classes.
		 */
		drivers : {},
		
		/**
		 * Call this method to restore the original global object.
		 *
		 * @return multieditor
		 */
		noConflict : function () {
			if (window.multieditor === multieditor) {
				window.multieditor = _multieditor;
			}
			
			return multieditor;
		},
		
		/**
		 * Return an instance of the requested driver.
		 *
		 * @param string  driver
		 * @param Element el
		 * @param object  config
		 * 
		 * @return multieditor
		 */
		factory : function (driver, el, config) {
			if ('undefined' !== typeof this.drivers[driver]) {
				return new this.drivers[driver](el, config);
			}
			
			throw new Error('multieditor driver not found: ' + driver);
		}
	};
	
	// Expose multieditor to the global object.
	window.multieditor = multieditor;
}) ();
