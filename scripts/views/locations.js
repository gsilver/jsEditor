define([
	'underscore',
	'backbone',
	'text!templates/locations.tpl',
	'views/trigger_location_editor',
	'vent'
], function(_, Backbone, Template, TriggerLocationEditorView, vent) {
	return Backbone.Marionette.ItemView.extend({
		template: _.template(Template),
		className: 'full-height',

		initialize: function() {
			this.mousedown = false;
		},

		onRender: function() {
			var view = this;
			setTimeout(function() {view.renderMap()}, 300);
		},

		renderMap: function() {
			var view = this;

			// Render Map
			var element = this.$el.find('.map-canvas').get(0);

			var default_location = new google.maps.LatLng(42.2767097, -83.7375668);
			var map_options = {
				zoom: 16,
				center: default_location
			};

			var map      = new google.maps.Map(element, map_options);
			var boundary = new google.maps.LatLngBounds();

			// MGOV-7 - add current position of user
			// if cannot handle or does not allow, default to Central Campus, centered on DIAG
      navigator.geolocation.getCurrentPosition(function(position) {
          var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          var infowindow = new google.maps.InfoWindow({
              map: map,
              position: geolocate,
              content:
                    '<p>You are here:</>' +
                    '<p>Latitude: ' + position.coords.latitude + '</p>' +
                    '<p>Longitude: ' + position.coords.longitude + '</p>'
          });            
          map.setCenter(geolocate);
      });

			_.each(this.collection.models, function(trigger) {
				// Add Trigger Location to map
				var location_position = new google.maps.LatLng(trigger.get("latitude"), trigger.get("longitude"));

				var circle_marker = new google.maps.Circle({
					center: location_position,
					draggable: false,
					editable: true,
					radius: parseFloat(trigger.get("distance")),
					map: map,
					suppressUndo: true,
					fillColor: '#428bca',
					strokeColor: '#428bca'
				});

				var drag_marker = new google.maps.Marker({
					position: location_position,
					title: trigger.get("title"),
					map: map,
					//icon: "images/glyphicons_309_comments.png",
					draggable: true
				})

				circle_marker.bindTo('center', drag_marker, 'position');


				// Hide radius when range is infinite
				if(trigger.get("infinite_distance") == "1")
				{
					drag_marker.setIcon("images/marker-green.png");
					circle_marker.setVisible(false);
				}

				// TODO option to show overlapping ranges?

				// Map Boundaries

				var extend_map = function(circle) {
					// Add circle radius to map boundary
					boundary = boundary.union(circle.getBounds());

					// Fit map to all locations
					map.setCenter(boundary.getCenter());
					map.fitBounds(boundary);
				}

				// Zoom to fit all markers

				extend_map(circle_marker);


				// Track drag and resize

				google.maps.event.addListener(circle_marker, 'radius_changed', function() {
					// Quick Save to allow the cancel button to work.
					trigger.save({"distance": String(circle_marker.getRadius())}, {patch: true});
				});

				google.maps.event.addListener(drag_marker, 'dragend', function() {
					var center = circle_marker.getCenter();

					// Quick Save to allow the cancel button to work.
					trigger.save({"latitude": String(center.lat()), "longitude": String(center.lng())}, {patch: true});
				});


				// Edit side bar

				google.maps.event.addListener(circle_marker, 'mousedown', function() {

					// Don't re-open on drag
					vent.trigger("application:info:current_view", function(current_view)
					{
						if(!current_view || current_view.model !== trigger)
						{
							vent.trigger("application:info:show", new TriggerLocationEditorView({model: trigger}));
						}
					});
				});

				google.maps.event.addListener(drag_marker, 'mousedown', function() {

					// Don't re-open on drag
					vent.trigger("application:info:current_view", function(current_view)
					{
						if(!current_view || current_view.model !== trigger)
						{
							vent.trigger("application:info:show", new TriggerLocationEditorView({model: trigger}));
						}
					});
				});


				// Hover

				google.maps.event.addListener(circle_marker, 'mouseover', function() {
					circle_marker.setOptions({fillColor: '#5bc0de'});
					circle_marker.setOptions({strokeColor: '#5bc0de'});;
				});

				google.maps.event.addListener(circle_marker, 'mouseout', function() {
					circle_marker.setOptions({fillColor: '#428bca'});
					circle_marker.setOptions({strokeColor: '#428bca'});;
				});


				// Events triggered by other views

				trigger.on("show_range", function() {
					drag_marker.setIcon();
					circle_marker.setVisible(true);
				});

				trigger.on("hide_range", function() {
					drag_marker.setIcon("images/marker-green.png");
					circle_marker.setVisible(false);
				});

				trigger.on("update_map", function() {
					circle_marker.setCenter(new google.maps.LatLng(trigger.get("latitude"), trigger.get("longitude")));
					circle_marker.setRadius(parseFloat(trigger.get("distance")));

					if(trigger.get("infinite_distance") == "1")
					{
						drag_marker.setIcon("images/marker-green.png");
						circle_marker.setVisible(false);
					}
					else {
						drag_marker.setIcon();
						circle_marker.setVisible(true);
					}
				});

				trigger.on("center_map", function() {
					map.setCenter(circle_marker.getBounds().getCenter());
					map.fitBounds(circle_marker.getBounds());
				});

				trigger.on("remove_marker", function() {
					circle_marker.setMap (null);
					drag_marker.setMap   (null);

					circle_marker = null;
					drag_marker   = null;
				});

			}); /* _.each model */
		}
	});
});
