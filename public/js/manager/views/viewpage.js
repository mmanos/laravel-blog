Manager.View.Viewpage = Backbone.View.extend({
	events: {
		'click #posts-wrapper #new-post' : 'newPost',
		'click #preview-wrapper #edit-post' : 'editPost',
		'click #preview-wrapper #delete-post' : 'deletePost',
		'click #show-more .btn' : 'showMore'
	},
	
	initialize : function() {
		this.post = null;
		this.converter = new Markdown.Converter();
		
		this.preview_wrapper = this.$('#preview-wrapper');
		this.preview = this.$('#preview');
		
		this.posts_list = this.$('#posts');
		this.posts = new Manager.Collection.Posts();
		
		this.listenTo(this.posts, 'add', this.addOne);
		this.listenTo(this.posts, 'reset', this.addAll);
		
		this.show_more = this.$('#show-more');
		
		this.page = 1;
		this.posts.fetch({data:{
			page : this.page
		}});
		
		this.pending_posts = new Manager.Collection.Posts();
		this.queueMore();
		
		$(window).resize($.proxy(this.resizeBoxes, this));
	},
	
	addOne : function (post) {
		var view = new Manager.View.Post({
			model : post,
			id    : 'post-' + post.get('id')
		});
		var appended = false;
		
		this.posts_list.find('li').each(function () {
			if ($(this).data('id') && post.get('id') >= $(this).data('id')) {
				$(this).before(view.render().el);
				appended = true;
				return false;
			}
		});
		if (!appended) {
			this.$('#show-more').before(view.render().el);
		}
	},
	
	addAll : function () {
		this.posts.each(this.addOne, this);
	},
	
	render : function () {
		this.$('#posts li').removeClass('active');
		this.preview_wrapper.hide();
		
		if (this.post) {
			this.$('#post-' + this.post.get('id')).addClass('active');
			this.$('#preview-wrapper .actions .status').html(
				this.post.get('published') ? 'Published' : 'Draft'
			);
			
			this.preview.html(
				this.converter.makeHtml(this.post.get('content'))
			);
			this.preview_wrapper.show();
		}
	},
	
	selectPost : function (id) {
		this.post = null;
		this.render();
		
		if (id) {
			var post = this.posts.get(id);
			if (post) {
				this.post = post;
				this.render();
			}
			else {
				var post = new Manager.Model.Post({id:id});
				post.fetch({
					success : $.proxy(function (post) {
						this.posts.add(post);
						this.post = post;
						this.render();
					}, this)
				});
			}
		}
		else {
			var post = this.posts.at(0);
			if (post) {
				this.post = post;
				this.render();
			}
		}
	},
	
	newPost : function (e) {
		e.preventDefault();
		
		Manager.app.router.navigate('manager/new', {trigger:true});
	},
	
	editPost : function (e) {
		e.preventDefault();
		
		if (!this.post) {
			return;
		}
		
		Manager.app.router.navigate(this.post.link('edit'), {trigger:true});
	},
	
	deletePost : function (e) {
		e.preventDefault();
		
		if (!this.post) {
			return;
		}
		
		if (confirm('Are you sure you want to delete this post?')) {
			this.post.destroy();
			Manager.app.router.navigate('manager', {trigger:true});
		}
	},
	
	queueMore : function () {
		this.pending_posts.reset([]);
		
		this.pending_posts.fetch({
			data : {
				page : (this.page + 1)
			},
			success : $.proxy(function (collection, response, options) {
				if (response.length) {
					this.show_more.show();
				}
				else {
					this.show_more.hide();
				}
			}, this),
			error : $.proxy(function () {
				this.show_more.hide();
			}, this)
		});
	},
	
	showMore : function () {
		if (!this.pending_posts.length) {
			return;
		}
		
		var post;
		while (post = this.pending_posts.pop()) {
			this.posts.add(post);
		}
		
		this.show_more.hide();
		this.page++;
		this.queueMore();
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
	}
});
