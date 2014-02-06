Manager.Collection.Posts = Backbone.Collection.extend({
	url   : function () {
		return '/blogadmin/' + Manager.blog_id + '/posts';
	},
	model : Manager.Model.Post
});
