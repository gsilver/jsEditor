define([
	'module',
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'models/session',
	'text!../../templates/login.tpl',
	'i18n!../locale/nls/login.js'
], function(module, $, _, Backbone, Marionette, session, Template, t) {

	return Backbone.Marionette.ItemView.extend({
		template: function(data) {
			return _.template(Template, _.extend(data, {t:t}));
		},

		events: {
			"click #login": "onClickLogin"
		},

		onClickLogin: function() {
			// TODO add field validation
			// and trigger event instead of relying on session.
			//
			session.login({
				username: this.$el.find('#username').val(),
				password: this.$el.find('#password').val()
			});

			// Don't submit form
			event.preventDefault();
		}
	});
});
