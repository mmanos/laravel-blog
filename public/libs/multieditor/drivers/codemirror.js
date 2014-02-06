(function (multieditor) {
	/**
	 * Codemirror multieditor driver class.
	 *
	 * @param Element el
	 * @param object  config
	 * 
	 * @return void
	 */
	multieditor.drivers.codemirror = function (el, config) {
		this.el = el;
		this.config = config || {};
		this.$ = this.config.$ || $;
		this.editor = null;
		this.editorConfig = this.config.editor || {};
		
		this.init();
	};
	
	/**
	 * Init editor.
	 *
	 * @return void
	 */
	multieditor.drivers.codemirror.prototype.init = function () {
		var options = this.$.extend({}, {
			mode         : 'markdown',
			lineWrapping : true,
			extraKeys    : {"Enter": "newlineAndIndentContinueMarkdownList"}
		}, this.editorConfig);
		
		this.editor = CodeMirror.fromTextArea(this.el, options);
		
		this.editor.on('change', $.proxy(function () {
			this.changed();
		}, this));
	};
	
	/**
	 * Set the content for this editor.
	 *
	 * @param string str
	 * 
	 * @return void
	 */
	multieditor.drivers.codemirror.prototype.setContent = function (str) {
		this.editor.setValue(str);
	};
	
	/**
	 * Get the content from this editor.
	 *
	 * @return string
	 */
	multieditor.drivers.codemirror.prototype.getContent = function () {
		return this.editor.getValue();
	};
	
	/**
	 * Set the width for this editor.
	 *
	 * @param integer width
	 * 
	 * @return void
	 */
	multieditor.drivers.codemirror.prototype.setWidth = function (width) {
		this.editor.setSize(width, null);
	};
	
	/**
	 * Set the content for this editor.
	 *
	 * @param integer height
	 * 
	 * @return void
	 */
	multieditor.drivers.codemirror.prototype.setHeight = function (height) {
		this.editor.setSize(null, height);
	};
	
	/**
	 * Give focus to the editor.
	 *
	 * @return void
	 */
	multieditor.drivers.codemirror.prototype.focus = function (height) {
		this.editor.focus();
	};
	
	/**
	 * Called when editor content has changed.
	 *
	 * @return string
	 */
	multieditor.drivers.codemirror.prototype.changed = function () {
		if ('undefined' !== typeof this.config.changeEvent) {
			this.config.changeEvent();
		}
	};
	
}) (multieditor);
