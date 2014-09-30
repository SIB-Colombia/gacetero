var occurrencesES = require("../../models/elasticsearch/locationModel");
var _ = require('underscore');

exports.getLocationTreeData = function(req, res) {
	occurrences = occurrencesES.getLocationsTree();
	occurrences.exec(function(err, data) {
		res.jsonp(JSON.parse(data));
	});
};

exports.getLocationParamoTreeData = function(req, res) {
	occurrences = occurrencesES.getLocationsParamosTree();
	occurrences.exec(function(err, data) {
		res.jsonp(JSON.parse(data));
	});
};

exports.getAllOccurrences = function(req, res) {
	occurrences = occurrencesES.getAllOccurrences(req.params._name);
	occurrences.exec(function(err, data) {
		res.jsonp(JSON.parse(data));
	});
};

exports.loadInitialData = function(req, res) {
	occurrences = occurrencesES.getGeneralLocationData();
	occurrences.exec(function(err, data) {
		res.jsonp(JSON.parse(data));
	});
};

exports.suggestLocation = function(req, res) {
	occurrences = occurrencesES.getSimilarLocationDataWithShingles(req.params._name);
	occurrences.exec(function(err, data) {
		data = JSON.parse(data);
		if(data.aggregations && data.aggregations.biggest_countries.buckets[0]) {
			var previousLocation = "";
			var fullLocation = "";
			var location = "";
			var result = [];
			var counter = 0;
			_.each(data.aggregations.biggest_countries.buckets[0].top_country_hits.hits.hits, function(occurrence) {
				location = (occurrence._source.department_name !== null) ? occurrence._source.department_name+", " : "";
				location += (occurrence._source.county_name !== null) ? occurrence._source.county_name+", " : "";
				location += (occurrence._source.locality !== null) ? occurrence._source.locality+", " : "";
				location += (occurrence._source.paramo_name !== null) ? occurrence._source.paramo_name+", " : "";
				location += (occurrence._source.country_name !== null) ? occurrence._source.country_name : "";
				if(typeof occurrence.highlight !== 'undefined') {
					//console.log("definida");
					if(typeof occurrence.highlight["department_name.spanish"] !== 'undefined') {
						fullLocation = (occurrence.highlight["department_name.spanish"] !== null) ? occurrence.highlight["department_name.spanish"]+", " : "";
					} else {
						fullLocation = (occurrence._source.department_name !== null) ? occurrence._source.department_name+", " : "";
					}
					if(typeof occurrence.highlight["county_name.spanish"] !== 'undefined') {
						fullLocation += (occurrence.highlight["county_name.spanish"] !== null) ? occurrence.highlight["county_name.spanish"]+", " : "";
					} else {
						fullLocation += (occurrence._source.county_name !== null) ? occurrence._source.county_name+", " : "";
					}
					if(typeof occurrence.highlight["locality.spanish"] !== 'undefined') {
						fullLocation += (occurrence.highlight["locality.spanish"] !== null) ? occurrence.highlight["locality.spanish"]+", " : "";
					} else {
						fullLocation += (occurrence._source.locality !== null) ? occurrence._source.locality+", " : "";
					}
					if(typeof occurrence.highlight["paramo_name.spanish"] !== 'undefined') {
						fullLocation += (occurrence.highlight["paramo_name.spanish"] !== null) ? occurrence.highlight["paramo_name.spanish"]+", " : "";
					} else {
						fullLocation += (occurrence._source.paramo_name !== null) ? occurrence._source.paramo_name+", " : "";
					}
					if(typeof occurrence.highlight["country_name.spanish"] !== 'undefined') {
						fullLocation += (occurrence.highlight["country_name.spanish"] !== null) ? occurrence.highlight["country_name.spanish"]+", " : "";
					} else {
						fullLocation += (occurrence._source.country_name !== null) ? occurrence._source.country_name+", " : "";
					}
					fullLocation += "(lat: "+occurrence._source.location.lat+",lon: "+occurrence._source.location.lon+")";
				} else {
					fullLocation = location;
				}
				if(previousLocation !== fullLocation) {
					result[counter] = {location: location, location_highlight: fullLocation};
					counter += 1;
					previousLocation = fullLocation
				}
			});
			res.jsonp(result);	
		} else {
			res.jsonp([]);
		}
	});
};

exports.suggestLocationByCoordinates = function(req, res) {
	occurrences = occurrencesES.getSimilarLocationDataByCoordinates(req.params._latitude, req.params._longitude);
	occurrences.exec(function(err, data) {
		data = JSON.parse(data);
		if(data.aggregations && data.aggregations.biggest_countries.buckets[0]) {
			var previousLocation = "";
			var fullLocation = "";
			var location = "";
			var result = [];
			var counter = 0;
			_.each(data.aggregations.biggest_countries.buckets[0].top_country_hits.hits.hits, function(occurrence) {
				fullLocation = "<em>(lat: "+occurrence._source.location.lat+", long: "+occurrence._source.location.lon+")</em> ";
				fullLocation += (occurrence._source.department_name !== null) ? occurrence._source.department_name+", " : "";
				fullLocation += (occurrence._source.county_name !== null) ? occurrence._source.county_name+", " : "";
				fullLocation += (occurrence._source.locality !== null) ? occurrence._source.locality+", " : "";
				fullLocation += (occurrence._source.paramo_name !== null) ? occurrence._source.paramo_name+", " : "";
				fullLocation += (occurrence._source.country_name !== null) ? occurrence._source.country_name : "";
				location = occurrence._source.location.lat+","+occurrence._source.location.lon;
				if(previousLocation !== fullLocation) {
					result[counter] = {location: location, location_highlight: fullLocation};
					counter += 1;
					previousLocation = fullLocation
				}
			});
			res.jsonp(result);	
		} else {
			res.jsonp([]);
		}
	});
};