define(["knockout", "app/viewModels/LocationSearchViewModel", "bootstrap", "app/map-initialize"], function(ko, LocationSearchViewModel, bootstrap, map) {
	
	// Components can bepackaged as AMD modules
  ko.components.register('tree', { require: 'app/components/tree/tree' });

	ko.applyBindings(new LocationSearchViewModel(), $("#map-filter-area")[0]);
});