define([
	'underscore',
	'backbone',
	'text!templates/location_item.tpl',
	'vent',
	'views/edit_json_model',
], function(_, Backbone, Template, vent, EditJsonModelView) {
	return Backbone.Marionette.ItemView.extend({
		template: _.template(Template),

		// Bootstrap
		tagName: 'tr',


		events: {
			"click .edit":         "onClickEdit",
			"click .requirements": "onClickRequirements"
		},


		onClickEdit: function() {
			vent.trigger("application.show", new EditJsonModelView({model: this.model}));
			Backbone.history.navigate("#games/"+this.model.get('game_id')+"/locations/"+this.model.get('location_id')+"/edit", {trigger: false});
		},

		onClickRequirements: function() {
			Backbone.history.navigate("#games/"+this.model.get('game_id')+"/locations/"+this.model.get('location_id')+"/requirements", {trigger: true});
		}
	});
});
