Manager.View.Post = Backbone.View.extend({
	tagName   :  'li',
	className : 'post',
	
	template : _.template($('#template-post').html()),
	
	events: {
		'click' : 'click'
	},

	initialize : function() {
		this.$el.data('id', this.model.get('id'));
		
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},
	
	render : function () {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	
	click : function (e) {
		Manager.app.router.navigate(this.model.link(), {trigger:true});
	}
});
