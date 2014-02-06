var Manager = Manager || {};
Manager.View = Manager.View || {};
Manager.Model = Manager.Model || {};
Manager.Collection = Manager.Collection || {};

/**
 * Main app view class.
 */
Manager.View.App = Backbone.View.extend({
	el : $("#manager"),
	
	events : {
		'click #close-link' : 'close'
	},
	
	initialize : function () {
		this.viewpage = new Manager.View.Viewpage({
			el : this.$('#viewpage')
		});
		this.editpage = new Manager.View.Editpage({
			el : this.$('#editpage')
		});
		this.active_hash = '';
		
		var app = this;
		var routes = Backbone.Router.extend({
			routes: {
				'manager'          : 'view',
				'manager/'         : 'view',
				'manager/new'      : 'edit',
				'manager/:id'      : 'view',
				'manager/edit/:id' : 'edit',
				'*notfound'        : 'hide',
			},
			
			hide : function () {
				var obj = this;
				
				if (app.active_page && app.active_page.preRoute) {
					app.active_page.preRoute()
						.done(function () {
							delete app.active_page.preRoute;
							obj.doHide();
						})
						.fail(function () {
							delete app.active_page.preRoute;
							window.location.hash = app.active_hash;
						});
				}
				else {
					obj.doHide();
				}
			},
			
			view : function (id) {
				var obj = this;
				
				if (app.active_page && app.active_page.preRoute) {
					app.active_page.preRoute(id)
						.done(function () {
							obj.doView(id);
						})
						.fail(function () {
							window.location.hash = app.active_hash;
						});
					delete app.active_page.preRoute;
				}
				else {
					obj.doView(id);
				}
			},
			
			edit : function (id) {
				var obj = this;
				
				if (app.active_page && app.active_page.preRoute) {
					app.active_page.preRoute(id)
						.done(function () {
							obj.doEdit(id);
						})
						.fail(function () {
							window.location.hash = app.active_hash;
						});
					delete app.active_page.preRoute;
				}
				else {
					obj.doEdit(id);
				}
			},
			
			doHide : function () {
				app.hide();
				
				app.active_hash = window.location.hash;
				app.active_page = null;
			},
			
			doView : function (id) {
				app.show();
				
				app.editpage.hide();
				app.viewpage.show();
				app.viewpage.selectPost(id);
				
				app.active_hash = window.location.hash;
				app.active_page = app.viewpage;
			},
			
			doEdit : function (id) {
				app.show();
				
				app.viewpage.hide();
				app.editpage.show();
				app.editpage.selectPost(id);
				
				app.active_hash = window.location.hash;
				app.active_page = app.editpage;
			}
		});
		this.router = new routes();
	},
	
	show : function () {
		this.$el.show();
		$('body').css('overflow', 'hidden');
	},
	
	hide : function () {
		this.$el.hide();
		$('body').css('overflow', 'auto');
	},
	
	close : function () {
		this.router.navigate('', {trigger:true});
	},
	
	msg : function (msg, type) {
		if ('undefined' === typeof type) {
			type = 'info';
		}
		
		this.$('#alerts').html('');
		
		$('<div/>').addClass('alert')
			.addClass('alert-' + type)
			.html(msg)
			.appendTo(this.$('#alerts'));
		
		if (this.timer) {
			clearTimeout(this.timer);
		}
		
		this.timer = setTimeout(function () {
			this.$('#alerts').html('');
		}, 4000);
	}
});

// Start app on dom ready.
$(function () {
	$("#manager").appendTo($(document.body));
	
	Manager.blog_id = $("#manager").data('blogid');
	Manager.app = new Manager.View.App();
	Backbone.history.start();
})
