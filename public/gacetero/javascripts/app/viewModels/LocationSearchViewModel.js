define(["jquery", "knockout", "underscore", "app/models/baseViewModel", "app/map-initialize", "app/models/searchCondition", "knockout-postbox", "leaflet", "jquery.ui", "bootstrap", "leafletMarkerCluster", "knockoutJqAutocomplete", "leafletAwesomeMarkers"], function($, ko, _, BaseViewModel, map, SearchCondition) {
	var LocationSearchViewModel = function() {
		var self = this;

		// Total occurrences data
		self.totalGeoOccurrences = 0;
		self.totalGeoOccurrencesCache = 0;
		self.totalCountries = 0;
		self.totalDepartments = 0;
		self.totalCounties = 0;
		self.totalLocalities = 0;
		self.totalParamos = 0;

		self.totalSearchConditions = 0;

		// Single search condition
		self.searchCondition = "";

		// Full list of search conditions
		self.searchConditions = [];

		BaseViewModel.apply( this, arguments );
	};

	_.extend(LocationSearchViewModel.prototype, BaseViewModel.prototype, self.densityCellsOneDegree, {
		initialize: function() {
			var self = this;
			markers = new L.MarkerClusterGroup({
				spiderfyOnMaxZoom: true,
				showCoverageOnHover: true,
				zoomToBoundsOnClick: true,
				removeOutsideVisibleBounds: true,
				disableClusteringAtZoom: 15
			});

			self.searchCondition.syncWith("searchCondition");
			this.loadInitialData();
			$("#searchBox").keypress(function (e) {
				if (e.which == 13) {
					self.searchCondition($("#searchBox").val());
					self.searchOccurrences();
				} 
			});
		},
		loadInitialData: function() {
			var self = this;
			self.hideMapAreaWithSpinner();
			$.getJSON("/gacetero/api/location/resumedata", function(allData) {
				self.totalGeoOccurrences(allData.hits.total);
				self.totalCountries(allData.aggregations.country_count.value);
				self.totalDepartments(allData.aggregations.department_count.value);
				self.totalCounties(allData.aggregations.counties_count.value);
				self.totalLocalities(allData.aggregations.localities_count.value);
				self.totalParamos(allData.aggregations.paramos_count.value);
				self.showMapAreaWithSpinner();
			});
			// Uncomment to enable multiple search conditions
			//self.searchConditions.push(new SearchCondition({searchText: ""}));
			self.totalSearchConditions(self.totalSearchConditions()+1);
		},
		searchOptions: function(searchTerm, callback) {
			var regExp = /^\s*-{0,1}\d+.{0,1}\d*\s*,\s*-{0,1}\d+.{0,1}\d*\s*$/;
			if(!regExp.test(searchTerm)) {
				$.ajax({
					dataType: "json",
					url: "/gacetero/api/location/similar/"+searchTerm
				}).done(callback);
			} else {
				var location = searchTerm.match(/-{0,1}\d+.{0,1}\d*/g);
				$.ajax({
					dataType: "json",
					url: "/gacetero/api/location/similar/"+location[0]+"/"+location[1]
				}).done(callback);
			}
		},
		searchKeyboardCmd: function (data, event) {
			var self = this;
			console.log(data);
			console.log(event);
			if (event.keyCode == 13) {
				self.searchOccurrences();
			}
			return true;
		},
		searchOccurrences: function() {
			var self = this;
			if(self.searchCondition() !== "") {
				$("#notes").hide();
				self.hideMapAreaWithSpinner();
				self.loadOccurrencesMarkers();
				//self.enableOccurrencesDetail();
			}
		},
		loadOccurrencesMarkers: function() {
			var self = this;
			if(map.hasLayer(markers)) {
				map.removeLayer(principalLocation);
				map.removeLayer(markers);
				markers.clearLayers();
			}
			var redMarker = L.AwesomeMarkers.icon({
				icon: 'glyphicon-star',
				markerColor: 'red'
			});
			var smallIcon = L.icon({
				iconUrl: 'images/leaflet/marker-icon_small.png',
				shadowUrl: 'images/leaflet/marker-shadow_small.png',

				iconSize:     [15, 25], // size of the icon
				shadowSize:   [31, 31], // size of the shadow
				iconAnchor:   [7.5, 24], // point of the icon which will correspond to marker's location
				shadowAnchor: [9, 30],  // the same for the shadow
				popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
			});
			var searchText = self.searchCondition();
			searchText = searchText.toLowerCase().replace(/departamento:/g,'department_name.spanish:');
			searchText = searchText.toLowerCase().replace(/pais:/g,'country_name.spanish:');
			searchText = searchText.toLowerCase().replace(/país:/g,'country_name.spanish:');
			searchText = searchText.toLowerCase().replace(/municipio:/g,'county_name.spanish:');
			searchText = searchText.toLowerCase().replace(/localidad:/g,'locality.spanish:');
			searchText = searchText.toLowerCase().replace(/paramo:/g,'paramo_name.spanish:');
			searchText = searchText.toLowerCase().replace(/páramo:/g,'paramo_name.spanish:');
			searchText = searchText.replace(/ y /g,' AND ');
			searchText = searchText.replace(/ o /g,' OR ');
			searchText = searchText.replace(/\//g,' '); // Replace slash to avoid URL error
			$.getJSON("/gacetero/api/location/alloccurrences/"+searchText, function(allData) {
				if(allData.hits.total > 0) {
					$.each(allData.hits.hits, function(i, occurrence) {
						var marker = new L.Marker([occurrence._source.location.lat, occurrence._source.location.lon], {icon: smallIcon, clickable: true, zIndexOffset: 1000, title: "Latitud: "+occurrence._source.location.lat+", Longitud: "+occurrence._source.location.lon});
						marker.bindPopup("<strong>Departamento: </strong>"+occurrence._source.department_name+"</br><strong>Municipio: </strong>"+occurrence._source.county_name+"</br><strong>Localidad: </strong>"+occurrence._source.locality+((occurrence._source.paramo_name !== null) ? "</br><strong>Páramo: </strong>"+occurrence._source.paramo_name : "")+"</br><strong>País: </strong>"+occurrence._source.country_name+"</br><strong>Latitud: </strong>"+occurrence._source.location.lat+"</br><strong>Longitud: </strong>"+occurrence._source.location.lon);
						markers.addLayer(marker);
					});
					if(allData.hits.hits[0]) {
						occurrence = allData.hits.hits[0];
						principalLocation = new L.Marker([occurrence._source.location.lat, occurrence._source.location.lon], {icon: redMarker, clickable: true, zIndexOffset: 1000, title: "Latitud: "+occurrence._source.location.lat+", Longitud: "+occurrence._source.location.lon});
						principalLocation.bindPopup("<strong>Departamento: </strong>"+occurrence._source.department_name+"</br><strong>Municipio: </strong>"+occurrence._source.county_name+"</br><strong>Localidad: </strong>"+occurrence._source.locality+((occurrence._source.paramo_name !== null) ? "</br><strong>Páramo: </strong>"+occurrence._source.paramo_name : "")+"</br><strong>País: </strong>"+occurrence._source.country_name+"</br><strong>Latitud: </strong>"+occurrence._source.location.lat+"</br><strong>Longitud: </strong>"+occurrence._source.location.lon);
						map.addLayer(principalLocation);
						map.addLayer(markers);
					}
					if(markers._topClusterLevel._childCount == 10000 && allData.hits.total > 10000) {
						$("#notes").fadeIn();	
					}
					// Fill resume data about found occurrences
					self.totalGeoOccurrences(allData.hits.total);
					self.totalCountries(allData.aggregations.country_count.value);
					self.totalDepartments(allData.aggregations.department_count.value);
					self.totalCounties(allData.aggregations.counties_count.value);
					self.totalLocalities(allData.aggregations.localities_count.value);
					self.totalParamos(allData.aggregations.paramos_count.value);
				} else {
					$("#information").fadeIn().delay(3000).fadeOut();
				}
				self.showMapAreaWithSpinner();
			});
		},
		removeSearchCondition: function(parent, selectedSearchCondition) {
			var self = parent;
			self.searchConditions.remove(selectedSearchCondition);
			self.totalSearchConditions(self.totalSearchConditions()-1);
		},
		addSearchCondition: function() {
			var self = this;
			self.searchConditions.push(new SearchCondition({searchText: ""}));
			self.totalSearchConditions(self.totalSearchConditions()+1);
		},
		disableOccurrencesDetail: function() {
			if(!$("#occurrenceDetail").is(':hidden')) {
				$("#occurrenceDetail").fadeOut();
			}
		},
		enableOccurrencesDetail: function() {
			if($("#occurrenceDetail").is(':hidden')) {
				$("#occurrenceDetail").animate({height: 'toggle'}, 500, "swing");
			}
		},
		hideMapAreaWithSpinner: function() {
			$("#mapa").addClass("opacity-element");
			$("#filterZone").addClass("occult-element");
			$("#processing-request").removeClass("hide-element");
		},
		showMapAreaWithSpinner: function() {
			$("#filterZone").removeClass("occult-element");
			$("#mapa").removeClass("opacity-element");
			$("#processing-request").addClass("hide-element");
		}
	});

	return LocationSearchViewModel;
});
