requirejs.config({
  //By default load any module IDs from js/lib
  baseUrl: '/gacetero/javascripts',
  //except, if the module ID starts with "app",
  //load it from the js/app directory. paths
  //config is relative to the baseUrl, and
  //never includes a ".js" extension since
  //the paths config could be for a directory.
  paths: {
    'app': 'app',
    'jquery': '../bower_modules/jquery/dist/jquery.min',
    'jquery.ui': '../bower_modules/jquery-ui/jquery-ui.min',
    'underscore': '../bower_modules/underscore/underscore',
    'leaflet': '../bower_modules/leaflet/dist/leaflet',
    'leafletProviders': '../bower_modules/leaflet-providers/leaflet-providers',
    'leafletControlFullScreen': '../bower_modules/leaflet.fullscreen/Control.FullScreen',
    'leafletGoogleTiles': '../bower_modules/leaflet-plugins/layer/tile/Google',
    'leafletBingTiles': '../bower_modules/leaflet-plugins/layer/tile/Bing',
    'leafletMarkerCluster': '../bower_modules/leaflet.markercluster/dist/leaflet.markercluster',
    'leafletAwesomeMarkers': '../bower_modules/Leaflet.awesome-markers/dist/leaflet.awesome-markers.min',
    'bootstrap': '../bower_modules/components-bootstrap/js/bootstrap.min',
    'knockout': '../bower_modules/knockoutjs/dist/knockout',
    'knockout-postbox': '../bower_modules/knockout-postbox/build/knockout-postbox.min',
    'knockoutJqAutocomplete': '../bower_modules/knockout-jqAutocomplete/build/knockout-jqAutocomplete.min',
    'leafletZoomSlider': '../bower_modules/leaflet-zoomslider/src/L.Control.Zoomslider',
    'jqGrid': 'lib/jqgrid/js/jquery.jqGrid.min',
    'jqGrid.locale.spanish': 'lib/jqgrid/js/i18n/grid.locale-es',
    'jadeRuntime': 'lib/jadeRuntime/jadeRuntime',
    'text': '../bower_modules/requirejs-text/text',
    'jstree': '../bower_modules/jstree/dist/jstree.min'
  },
  shim: {
    'leaflet': {
      exports: 'L'
    },
    'leafletProviders': {
      deps: ['leaflet']
    },
    'leafletBingTiles': {
      deps: ['leaflet']
    },
    'leafletGoogleTiles': {
      deps: ['leaflet']
    },
    'leafletControlFullScreen': {
      deps: ['leaflet']
    },
    'leafletZoomSlider': {
      deps: ['leaflet']
    },
    'leafletMarkerCluster': {
      deps: ['leaflet']
    },
    'leafletAwesomeMarkers': {
      deps: ['leaflet']
    },
    'jquery.ui': {
      deps: ['jquery']
    },
    'bootstrap': {
      deps: ['jquery', 'jquery.ui']
    },
    'jqGrid.locale.spanish': {
      deps: ['jquery']
    },
    'jqGrid': {
      deps: ['jquery']
    },
    'underscore': {
      exports: '_'
    },
    'knockoutJqAutocomplete': {
      deps: ['knockout', 'jquery.ui']
    },
    'knockout-postbox': {
      deps: ['knockout']
    },
    'jstree': {
      deps: ['jquery']
    }
  }
});

// Load the main app module to start the app
require(["app/main"], function() {
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-1418857-10']);
  _gaq.push(['_setDomainName', 'sibcolombia.net']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

  $('a[data-toggle="tab"]').on('shown', function (e) {
    // Map Height
    $("#mapa").height($(window).height()-$("header").height());
  });
});
