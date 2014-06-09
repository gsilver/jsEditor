define([
	'backbone',
	'text!templates/alert.tpl',
	'vent'
], function(Backbone, Template, vent) {

	return Backbone.Marionette.CompositeView.extend({
		template: _.template(Template),

		templateHelpers: function() {
			return {
				text: this.options.text
			}
		},

		className: "clearfix"
	});
});

