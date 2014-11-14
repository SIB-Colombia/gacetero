define(["jquery", "leaflet", "jquery.ui", "leafletGoogleTiles", "leafletBingTiles", "leafletProviders", "leafletControlFullScreen", "leafletZoomSlider"], function($) {
	
	L.Control.MousePosition = L.Control.extend({
	  options: {
	    position: 'bottomright',
	    separator: ' : ',
	    emptyString: 'Unavailable',
	    lngFirst: false,
	    numDigits: 5,
	    lngFormatter: undefined,
	    latFormatter: undefined,
	    prefix: ""
	  },

	  onAdd: function (map) {
	    this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
	    L.DomEvent.disableClickPropagation(this._container);
	    map.on('mousemove', this._onMouseMove, this);
	    this._container.innerHTML=this.options.emptyString;
	    return this._container;
	  },

	  onRemove: function (map) {
	    map.off('mousemove', this._onMouseMove)
	  },

	  _onMouseMove: function (e) {
	    var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
	    var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
	    var value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
	    var prefixAndValue = this.options.prefix + ' ' + value;
	    this._container.innerHTML = prefixAndValue;
	  }

	});

	L.Map.mergeOptions({
	  positionControl: false
	});

	L.Map.addInitHook(function () {
	  if (this.options.positionControl) {
	    this.positionControl = new L.Control.MousePosition();
	    this.addControl(this.positionControl);
	  }
	});

	L.control.mousePosition = function (options) {
	    return new L.Control.MousePosition(options);
	};

	// Set map initial height
	$("#mapa").height($(window).height()-$("header").height());

	// General map data info layers
	var cmAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
	var cmUrl = 'http://{s}.tile.cloudmade.com/83ad4e2c1ff74ab78a23d7d249673c39/{styleId}/256/{z}/{x}/{y}.png';
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmUrlCycle='http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png';
	var osmAttrib='Map data © OpenStreetMap contributors';
	var osmCycleAttrib='Map data © OpenCycleMap contributors';
	var mapQuest='http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.png';
	var mapQuestAttrib='Map data © Mapquest contributors';

	// Google maps layers
	var googleTerrain = new L.Google('TERRAIN');
	var googleRoadmap = new L.Google('ROADMAP');
	var googleSatellite = new L.Google('SATELLITE');
	var googleHibrido = new L.Google('HYBRID');

	// Bing layers
	var bingAereo = new L.BingLayer("Aj1S-ygOy4XFeEGY4GhvY9ydALrxiuRv6X4s0-yQwavRTzR1NQObd8DpGYyN-gJS");
	var bingRoads = new L.BingLayer("Aj1S-ygOy4XFeEGY4GhvY9ydALrxiuRv6X4s0-yQwavRTzR1NQObd8DpGYyN-gJS", {type: 'Road'});
	var bingAerialWithLabels = new L.BingLayer("Aj1S-ygOy4XFeEGY4GhvY9ydALrxiuRv6X4s0-yQwavRTzR1NQObd8DpGYyN-gJS", {type: 'AerialWithLabels'});
	
	// General map layers
	var openStreetMap = L.tileLayer(osmUrl, {attribution: osmAttrib});
	var openStreetMapCycle = L.tileLayer(osmUrlCycle, {attribution: osmCycleAttrib});
	var openMapQuest = L.tileLayer(mapQuest, {attribution: osmCycleAttrib, type: 'osm', subdomains: '1234'});
	var minimal = L.tileLayer(cmUrl, {styleId: 997, attribution: cmAttr});
	var midnight = L.tileLayer(cmUrl, {styleId: 999,   attribution: cmAttr});

	// Servicio WMS del INVEMAR del Mapa Ecosistemas Continentales Costeros y Marinos 1:500.000 MECCM500k 
	var invemarEcoregiones = L.tileLayer.wms("http://gis.invemar.org.co/arcgis/services/MECCM/1_TM_MECCM500k_EcosistemasMarinoCosteros/MapServer/WMSServer",
		{
			layers: 'Ecorregiones',
			format: 'image/png',
			transparent: true,
			attribution: "Fuente: Invemar - Colombia"
		}
	);
	var invemarAreaRegimenComun = L.tileLayer.wms("http://gis.invemar.org.co/arcgis/services/MECCM/1_TM_MECCM500k_EcosistemasMarinoCosteros/MapServer/WMSServer",
		{
			layers: 'Área de régimen común',
			format: 'image/png',
			transparent: true,
			attribution: "Fuente: Invemar - Colombia"
		}
	);
	var invemarLimiteDepartamental = L.tileLayer.wms("http://gis.invemar.org.co/arcgis/services/MECCM/1_TM_MECCM500k_EcosistemasMarinoCosteros/MapServer/WMSServer",
		{
			layers: 'Límite departamental',
			format: 'image/png',
			transparent: true,
			attribution: "Fuente: Invemar - Colombia"
		}
	);
	var invemarEcozonas = L.tileLayer.wms("http://gis.invemar.org.co/arcgis/services/MECCM/1_TM_MECCM500k_EcosistemasMarinoCosteros/MapServer/WMSServer",
		{
			layers: 'Ecozonas',
			format: 'image/png',
			transparent: true,
			attribution: "Fuente: Invemar - Colombia"
		}
	);
	var invemarEcosistemasCosteros = L.tileLayer.wms("http://gis.invemar.org.co/arcgis/services/MECCM/1_TM_MECCM500k_EcosistemasMarinoCosteros/MapServer/WMSServer",
		{
			layers: 'Ecosistemas Costeros',
			format: 'image/png',
			transparent: true,
			attribution: "Fuente: Invemar - Colombia"
		}
	);

	// WMS Server GeoSIB
	var humboldtComplejosParamos = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php",
		{
			layers: 'ComplejosParamos2012',
			format: 'image/png',
			transparent: true,
			crs: L.CRS.EPSG4326,
			attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia"
		}
	);
	var humboldtGrilla = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php",
		{
			layers: 'Grilla',
			format: 'image/png',
			transparent: true,
			crs: L.CRS.EPSG4326,
			attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia"
		}
	);
	var humboldtEmbalses = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php",
		{
			layers: 'embalse',
			format: 'image/png',
			transparent: true,
			crs: L.CRS.EPSG4326,
			attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia"
		}
	);
	var humboldtAreasProtegidasRunap = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php",
		{
			layers: 'AreasProtegidas_RUNAP',
			format: 'image/png',
			transparent: true,
			crs: L.CRS.EPSG4326,
			attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia"
		}
	);
	var humboldtLagunas = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php",
		{
			layers: 'laguna',
			format: 'image/png',
			transparent: true,
			crs: L.CRS.EPSG4326,
			attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia"
		}
	);
	var humboldtCentrosPoblados = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php",
		{
			layers: 'centros_poblados',
			format: 'image/png',
			transparent: true,
			crs: L.CRS.EPSG4326,
			attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia"
		}
	);
	var humboldtCuencasHidrograficas = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php",
		{
			layers: 'cuencas_hidrograficas',
			format: 'image/png',
			transparent: true,
			crs: L.CRS.EPSG4326,
			attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia"
		}
	);
	var humboldtCars = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php",
		{
			layers: 'Jurisdiccion_CARs',
			format: 'image/png',
			transparent: true,
			crs: L.CRS.EPSG4326,
			attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia"
		}
	);
	var humboldtParquesNacionalesNaturales = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php",
		{
			layers: 'ParquesNacionalesNaturales',
			format: 'image/png',
			transparent: true,
			crs: L.CRS.EPSG4326,
			attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia"
		}
	);
	var humboldtAicas = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php",
		{
			layers: 'aicas',
			format: 'image/png',
			transparent: true,
			crs: L.CRS.EPSG4326,
			attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia"
		}
	);
	var humboldtEcosistemasGenerales = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php",
		{
			layers: 'ecosistemas_generales',
			format: 'image/png',
			transparent: true,
			crs: L.CRS.EPSG4326,
			attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia"
		}
	);
	var humboldtResguardosIndigenas = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php",
		{
			layers: 'resguardos_indigenas',
			format: 'image/png',
			transparent: true,
			crs: L.CRS.EPSG4326,
			attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia"
		}
	);
	var humboldtComunidadesAfro = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php",
		{
			layers: 'comunidades_negras',
			format: 'image/png',
			transparent: true,
			crs: L.CRS.EPSG4326,
			attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia"
		}
	);
	var gbifGrid = L.tileLayer.wms("http://data.sibcolombia.net/geoserver/wms",
		{
			layers: 'gbif:country_borders,gbif:tabDensityLayer',
			format: 'image/png',
			transparent: true,
			opacity: 0.5,
			attribution: "GBIF, Density layer",
			filter: '()(<Filter><PropertyIsEqualTo><PropertyName>url</PropertyName><Literal><![CDATA[http://data.sibcolombia.net/maplayer/country/48]]></Literal></PropertyIsEqualTo></Filter>)()()'
		}
	);
	
	var baseLayers = {
		'Google terreno': googleTerrain,
		'Google mapa carreteras': googleRoadmap,
		'Google satélite': googleSatellite,
		'Google híbrido': googleHibrido,
		'Bing aereo': bingAereo,
		'Bing mapa carreteras': bingRoads,
		'Bing aereo con etiquetas': bingAerialWithLabels,
		"Stamen Watercolor": L.tileLayer.provider('Stamen.Watercolor'),
		"Acetate": L.tileLayer.provider('Acetate.all')
	};
	
	var map = L.map('mapa', {
		center: [4.781505, -79.804687],
		zoom: 6,
		zoomControl: false,
		//crs: L.CRS.EPSG4326,
		layers: [googleTerrain]
	});

	var wmsLayers = {
		'Invemar: Ecorregiones': invemarEcoregiones,
		'Invemar: Ecozonas': invemarEcozonas,
		'Invemar: Ecosistemas costeros': invemarEcosistemasCosteros,
		'Invemar: Área de régimen común': invemarAreaRegimenComun,
		'Invemar: Límite departamental': invemarLimiteDepartamental,
		"OpenWeatherMap: Clouds": L.tileLayer.provider('OpenWeatherMap.Clouds'),
		"OpenWeatherMap: CloudsClassic": L.tileLayer.provider('OpenWeatherMap.CloudsClassic'),
		"OpenWeatherMap: Precipitation": L.tileLayer.provider('OpenWeatherMap.Precipitation'),
		'GBIF: Density layer': gbifGrid
	};

	var overlays = {

	};
	
	baseAndFirstOverlays = L.control.layers(baseLayers, wmsLayers, {collapsed: true}).addTo(map);
	
	//L.control.layers(wmsLayers).addTo(map);
	L.control.fullscreen({
		position: 'topleft',
		title: 'Mostrar mapa en pantalla completa'
	}).addTo(map);

	featureGroup = new L.FeatureGroup().addTo(map);

	L.control.scale().addTo(map);

	// Leaflet mouse position
	L.control.mousePosition().addTo(map);
	
	// Zoom slider control
	L.control.zoomslider({
		position: 'topleft',
		title: 'Cambiar nivel de acercamiento.'
	}).addTo(map);

	// Enable floating windows for search floating window
	$(function() {
		$("#filterZone").draggable({handle: "#top-filterZone", axis: 'xy', containment : [0,0]});
	});

	// Enable min/max button for search floating window
	$(".minimize-maximize-button").click(function() {
		if($("#filtersContainer").is(':visible')) {
			$("#filterZone").removeClass("open");
		} else {
			$("#filterZone").addClass("open");
		}
		$("#filtersContainer").slideToggle();
		$("#filtersContainerHelp").css({display: 'none'});
	});

	// Set map initial height
	$("#mapa").height($(window).height()-$("header").height());

	// Change map and table grid height when windows resize
	$(window).resize(function(){
		$("#mapa").height($(window).height()-$("header").height());
	});

	return map;
});