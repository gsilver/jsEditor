<div class="object-editor container-fluid">
	<form class="form" role="form">
		<div class="row">

			<!-- Boolean Operator -->

			<div class="col-sm-4 padded-small">
				<div class="form-group">
				<select class="form-control boolean-operator">
					<option data-set="item_list" value="1" <%= option_selected(bool_operator === "1" && item_list_selection)  %>>Player has at least</option>
					<option data-set="item_list" value="0" <%= option_selected(bool_operator === "0" && item_list_selection)  %>>Player has less than</option>
					<option data-set="events"    value="1" <%= option_selected(bool_operator === "1" && !item_list_selection) %>>Player has already</option>
					<option data-set="events"    value="0" <%= option_selected(bool_operator === "0" && !item_list_selection) %>>Player has not yet</option>
				</select>
				</div>
			</div>

			<!-- Requirement Type -->

			<div class="col-sm-8 padded-small">
				<div class="form-group">
				<select class="form-control requirement">
					<% if(item_list_selection) { %>
					<optgroup label="Player Inventory/Attributes">
						<option value="PLAYER_HAS_ITEM"        <%= option_selected(requirement === "PLAYER_HAS_ITEM")        %>># of Item/Attribute</option>
						<option value="PLAYER_HAS_TAGGED_ITEM" <%= option_selected(requirement === "PLAYER_HAS_TAGGED_ITEM") %>># of Items/Attributes with Tag</option>
					</optgroup>
					<% } %>

					<% if(!item_list_selection) { %>
					<optgroup label="Game Object Interactions">
						<option value="PLAYER_VIEWED_DIALOG"        <%= option_selected(requirement === "PLAYER_VIEWED_DIALOG")        %>>Exited Conversation</option>
						<option value="PLAYER_VIEWED_DIALOG_SCRIPT" <%= option_selected(requirement === "PLAYER_VIEWED_DIALOG_SCRIPT") %>>Seen Conversation Line</option>
						<option value="PLAYER_VIEWED_PLAQUE"        <%= option_selected(requirement === "PLAYER_VIEWED_PLAQUE")        %>>Viewed Plaque</option>
						<option value="PLAYER_VIEWED_ITEM"          <%= option_selected(requirement === "PLAYER_VIEWED_ITEM")          %>>Inspected Item</option>
						<option value="PLAYER_VIEWED_WEB_PAGE"      <%= option_selected(requirement === "PLAYER_VIEWED_WEB_PAGE")      %>>Visited Web Page</option>
					</optgroup>

					<optgroup label="Notes">
						<option value="PLAYER_HAS_NOTE"                      <%= option_selected(requirement === "PLAYER_HAS_NOTE") %>>Created at least # Notes</option>
						<option value="PLAYER_HAS_NOTE_WITH_TAG"             <%= option_selected(requirement === "PLAYER_HAS_NOTE_WITH_TAG") %>>Created at least # Notes with Tag</option>
						<option value="PLAYER_HAS_UPLOADED_MEDIA_ITEM"       <%= option_selected(requirement === "PLAYER_HAS_UPLOADED_MEDIA_ITEM") %>>Created at least # Notes with Media near</option>
						<option value="PLAYER_HAS_UPLOADED_MEDIA_ITEM_IMAGE" <%= option_selected(requirement === "PLAYER_HAS_UPLOADED_MEDIA_ITEM_IMAGE") %>>Created at least # Notes with Image near</option>
						<option value="PLAYER_HAS_UPLOADED_MEDIA_ITEM_AUDIO" <%= option_selected(requirement === "PLAYER_HAS_UPLOADED_MEDIA_ITEM_AUDIO") %>>Created at least # Notes with Audio near</option>
						<option value="PLAYER_HAS_UPLOADED_MEDIA_ITEM_VIDEO" <%= option_selected(requirement === "PLAYER_HAS_UPLOADED_MEDIA_ITEM_VIDEO") %>>Created at least # Notes with Video near</option>
					</optgroup>

					<optgroup label="Social Interactions">
						<option value="PLAYER_HAS_NOTE_WITH_LIKES"     <%= option_selected(requirement === "PLAYER_HAS_NOTE_WITH_LIKES") %>>Created a Note with # Likes</option>
						<option value="PLAYER_HAS_NOTE_WITH_COMMENTS"  <%= option_selected(requirement === "PLAYER_HAS_NOTE_WITH_COMMENTS") %>>Created a Note with # Comments</option>
						<option value="PLAYER_HAS_GIVEN_NOTE_COMMENTS" <%= option_selected(requirement === "PLAYER_HAS_GIVEN_NOTE_COMMENTS") %>>Given # Comments on Notes</option>
					</optgroup>

					<optgroup label="Quests">
						<option value="PLAYER_HAS_COMPLETED_QUEST" <%= option_selected(requirement === "PLAYER_HAS_COMPLETED_QUEST") %>>Completed Quest</option>
					</optgroup>

					<optgroup label="External">
						<option value="PLAYER_HAS_RECEIVED_INCOMING_WEB_HOOK" <%= option_selected(requirement === "PLAYER_HAS_RECEIVED_INCOMING_WEB_HOOK") %>>Received Incoming Web Hook</option>
					</optgroup>
					<% } %>
				</select>
				</div>
			</div>
		</div>


		<div class="row">

			<div class="col-sm-4 padded-small">
				<div class="form-group">
				<% if(quantity_visible) { %>
					<div class="input-group">
						<span class="input-group-addon addon-bg-info">#</span>
						<input type="number" class="form-control quantity" value="<%= qty %>" min="0">
					</div>
				<% } %>
				</div>
			</div>

			<!-- Content Lists -->

			<% if(content_visible) { %>
				<div class="col-sm-6 padded-small">
					<div class="form-group">
					<select class="form-control content">
						<option value="0" selected disabled>- Select One -</option>

						<!-- Game Items -->
						<% if(content_items) { %>
							<optgroup label="Player Attributes">
								<% _.each(items.where({type: "ATTRIB"}), function(item) { %>
									<option value="<%= item.get("item_id") %>" <%= option_selected(content_id === item.get("item_id")) %>>
										<%= item.get("name") %>
									</option>
								<% }); %>
							</optgroup>

							<optgroup label="Items">
								<% _.each(items.where({type: "NORMAL"}), function(item) { %>
									<option value="<%= item.get("item_id") %>" <%= option_selected(content_id === item.get("item_id")) %>>
										<%= item.get("name") %>
									</option>
								<% }); %>
							</optgroup>

							<optgroup label="Web Items">
								<% _.each(items.where({type: "URL"}), function(item) { %>
									<option value="<%= item.get("item_id") %>" <%= option_selected(content_id === item.get("item_id")) %>>
										<%= item.get("name") %>
									</option>
								<% }); %>
							</optgroup>
						<% } /* End Items */ %>


						<!-- Item Tags -->
						<% if(content_tags) { %>
							<% tags.each(function(object) { %>
								<option value="<%= object.id %>" <%= option_selected(content_id === object.id) %>>
									<%= object.get("tag") %>
								</option>
							<% }); %>
						<% } %>


						<!-- Plaques -->
						<% if(content_plaques) { %>
							<% plaques.each(function(object) { %>
								<option value="<%= object.id %>" <%= option_selected(content_id === object.id) %>>
									<%= object.get("name") %>
								</option>
							<% }); %>
						<% } %>


						<!-- Dialogs -->
						<% if(content_dialogs) { %>
							<% dialogs.each(function(object) { %>
								<option value="<%= object.id %>" <%= option_selected(content_id === object.id) %>>
									<%= object.get("name") %>
								</option>
							<% }); %>
						<% } %>

						<!-- Dialog Scripts -->
						<% if(content_dialog_scripts) { %>
							<% dialog_scripts.each(function(object) { %>
								<option value="<%= object.id %>" <%= option_selected(content_id === object.id) %>>
									<%= sanitize_html(object.get("text")) %>
								</option>
							<% }); %>
						<% } %>


						<!-- Web Pages -->
						<% if(content_web_pages) { %>
							<% web_pages.each(function(object) { %>
								<option value="<%= object.id %>" <%= option_selected(content_id === object.id) %>>
									<%= object.get("name") %>
								</option>
							<% }); %>
						<% } %>


						<!-- Quests -->
						<% if(content_quests) { %>
							<% quests.each(function(object) { %>
								<option value="<%= object.id %>" <%= option_selected(content_id === object.id) %>>
									<%= object.get("name") %>
								</option>
							<% }); %>
						<% } %>


						<!-- Web Hooks -->
						<% if(content_web_hooks) { %>
							<% web_hooks.each(function(object) { %>
								<option value="<%= object.id %>" <%= option_selected(content_id === object.id) %>>
									<%= object.get("name") %>
								</option>
							<% }); %>
						<% } %>

					</select>
					</div>
				</div>
			<% } /* End Content visible */ %>

			<!-- Values for requirement type -->

			<% if(location_visible) { %>
				<div class="col-sm-2 padded-small">
					<div class="form-group">
						<input type="number" class="form-control latitude" value="<%= latitude %>" min="0">
					</div>
				</div>

				<div class="col-sm-2 padded-small">
					<div class="form-group">
						<input type="number" class="form-control longitude" value="<%= longitude %>" min="0">
					</div>
				</div>
				<div class="col-sm-2 padded-small">
					<div class="form-group">
						<input type="number" class="form-control distance" value="<%= distance %>" min="0">
					</div>
				</div>
			<% } %>

			<% if(!location_visible && !content_visible) { %>
				<div class="col-sm-6 padded-small">
					&nbsp;
				</div>
			<% } %>

			<div class="col-sm-2 padded-small">
				<button type="button" class="btn btn-link delete-atom">Remove</button>
			</div>
		</div>
	</form>
</div>
