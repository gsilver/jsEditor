define([
	'backbone',
	'text!templates/item_chooser.tpl',
	'models/item',
	'models/trigger',
	'models/instance',
	'models/media',
	'views/item_chooser_row',
	'views/item_trigger_editor',
	'vent'
], function(Backbone, Template, Item, Trigger, Instance, Media, ItemChooserRowView, ItemTriggerEditorView, vent) {

	return Backbone.Marionette.CompositeView.extend({
		template: _.template(Template),

		itemView: ItemChooserRowView,
		itemViewContainer: ".items",

		itemViewOptions: function(model, index) {
			return {
			  parent: this.options.parent
			}
		},

		events: {
			"click .new-item": "onClickNewItem"
		},

		/* TODO move complex sets like this into a controller */
		onClickNewItem: function() {
			var item     = new Item     ({game_id: this.options.parent.get("game_id")});
			var trigger  = new Trigger  ({game_id: this.options.parent.get("game_id"),scene_id: this.options.parent.get("scene_id")});
			var instance = new Instance ({game_id: this.options.parent.get("game_id")});

			// Do not need fetches since we are 'new'
			var icon     = new Media    ({media_id: trigger.get("icon_media_id")});

			var trigger_editor = new ItemTriggerEditorView({scene: this.options.parent, icon: icon, game_object: item, instance: instance, model: trigger, visible_fields: "create_game_object_with_trigger"});
			vent.trigger("application:popup:show", trigger_editor, "Add Item to Scene");
		},

		// Marionette override
		appendBuffer: function(compositeView, buffer) {
			var $container = this.getItemViewContainer(compositeView);
			$container.find(".foot").before(buffer);
		},

		appendHtml: function(compositeView, itemView, index){
			if (compositeView.isBuffering) {
			  compositeView.elBuffer.appendChild(itemView.el);
			}
			else {
			  // If we've already rendered the main collection, just
			  // append the new items directly into the element.
			  var $container = this.getItemViewContainer(compositeView);
			  $container.find(".foot").before(itemView.el);
			}
		}

	});
});
