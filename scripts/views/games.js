define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!../../templates/games.tpl',
	'collections/games',
	'views/game_item',
], function($, _, Backbone, Marionette, Template, GameCollection, GameItemView) {
	return Backbone.Marionette.CompositeView.extend({
		template: _.template(Template),

		itemView: GameItemView,

	    // Bootstrap wrapper
		tagName: "table",
		className: "table",


		events: {
			"click .new": "onClickNew"
		},


		onClickNew: function() {
			Backbone.history.navigate("#games/new", {trigger: true});
		}
	});
});
