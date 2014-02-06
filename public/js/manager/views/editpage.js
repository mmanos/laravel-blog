Manager.View.Editpage = Backbone.View.extend({
	events: {
		'click #editor-btn-save'             : 'saveChanges',
		'change #editor-title'               : 'titleChanged',
		'click #editor-btn-edit-permalink'   : 'toggleEditPermalink',
		'click #editor-btn-save-permalink'   : 'checkPermalink',
		'click #editor-btn-cancel-permalink' : 'toggleEditPermalink'
	},
	
	initialize : function() {
		this.post = null;
		this.skip_reset = false;
		this.converter = new Markdown.Converter();
		
		this.preview = this.$('#editor-preview');
		this.title_el = this.$('#editor-title');
		
		this.editor = multieditor.factory('codemirror', this.$('#editor-content').get(0), {
			changeEvent : $.proxy(this.syncContent, this)
		});
		
		$(window).resize($.proxy(this.resizeBoxes, this));
		
		var isCtrl = false;
		$(document).keyup(function (e) {
			if(e.which == 17) isCtrl=false;
		}).keydown($.proxy(function (e) {
			if(e.which == 17) isCtrl=true;
			if(e.which == 83 && isCtrl == true) {
				this.saveChanges();
				return false;
			}
		}, this));
		
		window.onbeforeunload = $.proxy(function() {
			if (this.$el.is(':visible') && this.hasChanges()) {
				return "You have unsaved changes!";
			}
		}, this);
	},
	
	render : function () {
		this.editor.setContent('');
		this.title_el.val('');
		this.$('#status-published').click();
		
		var pm_wrapper = this.$('#permalink-wrapper');
		var edit_pm_wrapper = this.$('#edit-permalink-wrapper');
		pm_wrapper.hide();
		edit_pm_wrapper.hide();
		pm_wrapper.find('#permalink').html('');
		edit_pm_wrapper.find('#editor-edit-permalink').val('');
		
		if (this.post && !this.post.isNew()) {
			this.editor.setContent(this.post.get('content'));
			this.title_el.val(this.post.get('title'));
			pm_wrapper.find('#permalink').html(this.post.get('name'));
			edit_pm_wrapper.find('#editor-edit-permalink').val(this.post.get('name'));
			pm_wrapper.show();
			
			if (!this.post.get('published')) {
				this.$('#status-draft').click();
			}
		}
		
		return this;
	},
	
	selectPost : function (id) {
		this.preRoute = this.preRouteTemplate;
		
		if (this.skip_reset) {
			this.skip_reset = false;
			return;
		}
		
		this.post = null;
		this.render();
		
		if (id) {
			var post = Manager.app.viewpage.posts.get(id);
			if (post) {
				this.post = post;
				this.render();
				this.editor.focus();
			}
			else {
				var post = new Manager.Model.Post({id:id});
				post.fetch({
					success : $.proxy(function (post) {
						Manager.app.viewpage.posts.add(post);
						this.post = post;
						this.render();
						this.editor.focus();
					}, this)
				});
			}
		}
		else {
			this.post = new Manager.Model.Post();
			this.render();
			this.title_el.focus();
		}
	},
	
	syncContent : function () {
		this.preProcess();
		
		var content = this.editor.getContent();
		
		var s = content;
		s = s.replace(/(^\s*)|(\s*$)/gi,"");
		s = s.replace(/[ ]{2,}/gi," ");
		s = s.replace(/\n /,"\n");
		var num_words = s.split(' ').length;
		
		this.preview.html(
			this.converter.makeHtml(content)
		);
		
		this.$('#editor-wordcount').html(num_words + ' word');
		if (num_words != 1) {
			this.$('#editor-wordcount').html(
				this.$('#editor-wordcount').html() + 's'
			);
		}
		
		this.postProcess();
	},
	
	saveChanges : function () {
		if (!this.post) {
			delete this.preRoute;
			Manager.app.router.navigate('manager', {trigger:true});
			return;
		}
		
		var title = this.title_el.val();
		if (title.length <= 0) {
			Manager.app.msg('Please enter a title.', 'error');
			this.title_el.focus();
			return;
		}
		
		var content = this.editor.getContent();
		if (content.length <= 0) {
			Manager.app.msg('Please enter some content.', 'error');
			this.editor.focus();
			return;
		}
		
		var status = this.$('#status-wrapper').find('input[name=status]:checked').val();
		
		delete this.preRoute;
		
		this.post.save({
			title     : title,
			content   : content,
			published : (status == 'active') ? 1 : 0
		}, {
			success : $.proxy(function () {
				Manager.app.viewpage.posts.add(this.post, {merge:true});
				Manager.app.msg('Your post has been saved.', 'success');
			}, this),
			error : $.proxy(function () {
				Manager.app.msg('Error saving post.', 'error');
			}, this)
		});
	},
	
	titleChanged : function () {
		if (!this.post) {
			return;
		}
		
		if (this.post.get('name')) {
			return;
		}
		
		this.$('#editor-edit-permalink').val(this.title_el.val());
		
		this.checkPermalink();
	},
	
	checkPermalink : function () {
		if (!this.post) {
			return;
		}
		
		var permalink = this.$('#editor-edit-permalink').val();
		
		var data = {};
		if (!this.post.isNew()) {
			data.id = this.post.get('id');
		}
		
		this.$('#permalink-wrapper').show();
		this.$('#edit-permalink-wrapper').hide();
		
		$.ajax({
			url  : '/blogadmin/' + Manager.blog_id + '/posts/namecheck/' + permalink,
			data : data,
			dataType : 'json'
		}).done($.proxy(function (response) {
			this.$('#permalink').html(response.permalink);
			this.$('#editor-edit-permalink').val(response.permalink);
			this.post.set('name', response.permalink);
		}, this));
	},
	
	toggleEditPermalink : function () {
		if (this.$('#permalink-wrapper').is(':visible')) {
			this.$('#permalink-wrapper').hide();
			this.$('#edit-permalink-wrapper').show();
		}
		else {
			this.$('#permalink-wrapper').show();
			this.$('#edit-permalink-wrapper').hide();
			this.$('#editor-edit-permalink').val(this.$('#permalink').html());
		}
	},
	
	show : function () {
		this.$el.show();
		this.resizeBoxes();
	},
	
	hide : function () {
		this.$el.hide();
	},
	
	resizeBoxes : function () {
		var app_height = Manager.app.$el.height();
		
		this.$('.page-height').each(function () {
			var el_padding = $(this).outerHeight() - $(this).height();
			$(this).height(app_height - $(this).offset().top - el_padding);
		});
		
		this.$('.section-scroll').each(function () {
			var parent = $(this).closest('.page-height');
			var el_padding = $(this).outerHeight() - $(this).height();
			
			$(this).height(parent.height() - $(this).position().top - el_padding);
		});
		
		// Set editor height.
		var editor_parent = this.$('.CodeMirror').closest('.page-height');
		var editor_padding = this.$('.CodeMirror').outerHeight() - this.$('.CodeMirror').height();
		this.editor.setHeight(editor_parent.height() - this.$('.CodeMirror').position().top - editor_padding);
	},
	
	hasChanges : function () {
		var changes = false;
		var title   = this.title_el.val();
		var content = this.editor.getContent();
		
		if (this.post && !this.post.isNew()) {
			if (title != this.post.get('title')
				|| content != this.post.get('content')
			) {
				changes = true;
			}
		}
		else {
			if (title.length > 0 || content.length > 0) {
				changes = true;
			}
		}
		
		return changes;
	},
	
	preRouteTemplate : function () {
		var d       = $.Deferred();
		var changes = this.hasChanges();
		
		if (changes) {
			if (!confirm('Are you sure you want to leave this page?')) {
				this.skip_reset = true;
				return d.reject();
			}
		}
		
		return d.resolve();
	},
	
	preProcess : function () {
		this.uploaders = this.uploaders || [];
		var obj = this;
		
		this.preview.find('.uploader').each(function () {
			var el = $(this);
			el.detach();
			
			obj.uploaders.push(el);
		});
	},
	
	postProcess : function () {
		var content = '';
		
		var image_parts = this.preview.html().split('(image)');
		for (var i = 0; i < image_parts.length; i++) {
			content += image_parts[i];
			
			if (i < image_parts.length - 1) {
				content += '<div class="imageupload" id="imageupload-' + i + '" data-num="' + i + '"></div>';
			}
		}
		
		this.preview.html(content);
		
		var obj = this;
		this.preview.find('.imageupload').each(function () {
			if (obj.uploaders.length <= 0) {
				obj.uploaders.push(obj.uploaderInstance($('<div/>')));
			}
			
			$(this).append(obj.uploaders.shift());
		});
	},
	
	uploaderInstance : function (el) {
		el.addClass('uploader');
		
		return el.fineUploader({
			request: {
				endpoint: '/blogadmin/' + Manager.blog_id + '/posts/qq',
				customHeaders: { Accept: 'application/json' }
			},
			template: '<div class="qq-uploader">' +
					'<div class="qq-upload-drop-area"><span>{dragZoneText}</span></div>' +
					'<span class="qq-upload-text">Drag image here - or</span> ' +
					'<div class="qq-upload-button btn btn-default">{uploadButtonText}</div>' +
					'<span class="qq-drop-processing hide"><span>{dropProcessingText}</span><span class="qq-drop-processing-spinner"></span></span>' +
					'<ul class="qq-upload-list"></ul>' +
				'</div>',
			fileTemplate: '<li>' +
					'<div class="qq-progress-bar-wrapper"><div class="qq-progress-bar"></div></div>' +
					'<span class="qq-upload-spinner"></span>' +
					'<span class="qq-upload-finished"></span>' +
					'<span class="qq-upload-file"></span>' +
					'<span class="qq-upload-size"></span>' +
					'<a class="qq-upload-cancel" href="#">{cancelButtonText}</a>' +
					'<span class="qq-upload-status-text">{statusText}</span>' +
				'</li>',
			text: {
				uploadButton: 'Select File'
			},
			classes: {
				success : 'alert alert-success',
				fail    : 'alert alert-error'
			},
			multiple: false,
			validation: {
				allowedExtensions: ['jpg', 'png', 'gif'],
				acceptFiles: 'image/*',
				sizeLimit: 512000000
			}
		}).on('complete', $.proxy(function(event, id, name, response){
			if (response.url) {
				var image_url     = response.url;
				var image_num     = el.parent().data('num');
				var content_parts = this.editor.getContent().split('(image)');
				var content       = '';
				
				for (var i = 0; i < content_parts.length; i++) {
					content += content_parts[i];
					
					if (i < content_parts.length - 1) {
						if (i === image_num) {
							content += '![](' + image_url + ')';
						}
						else {
							content += '(image)';
						}
					}
				}
				
				el.parent().remove();
				this.editor.setContent(content);
			}
		}, this));
	}
});
