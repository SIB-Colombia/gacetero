/*define(['knockout', 'knockout-mapping'], function(ko, knockoutMapping) {
	var NodeModel = function(data) {
		var self = this;
		self.isExpanded = ko.observable(true);
		self.description = ko.observable();
		self.name = ko.observable();
		self.nodes = ko.observableArray([]);

		self.toggleVisibility = function() {
			self.isExpanded(!self.isExpanded());
		};
		knockoutMapping.fromJS(data, self.mapOptions, self);
	};

	NodeModel.prototype.mapOptions = {
		nodes: {
			create: function(args) {
				return new NodeModel(args.data);
			}
		}
	};

	return NodeModel;
});*/