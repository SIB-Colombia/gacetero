define(["knockout"], function(ko) {
	var SearchCondition = function(data) {
		this.searchText = data.searchText;
	};

	return SearchCondition;
});