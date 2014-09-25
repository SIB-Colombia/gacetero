var express = require('express')
  , fs = require('fs');

module.exports = function(parent, options) {
	var verbose = options.verbose;
	fs.readdirSync(__dirname + '/../app/controllers').forEach(function(name) {
		verbose && logger.info('\n %s:', name);
		var obj = require('./../app/controllers/' + name)
		  , name = obj.name || name
		  , prefix = obj.prefix || ''
		  , app = express()
		  , method
		  , path;

		// allow specifying the view engine
		if (obj.engine) app.set('view engine', obj.engine);
		app.set('views', __dirname + '/../app/views/' + name);

		// before middleware support
		if (obj.before) {
			path = '/' + name + '/:' + name + '_id';
			app.all(path, obj.before);
			verbose && console.log(' ALL %s -> before', path);
			path = '/' + name + '/:' + name + '_id/*';
			app.all(path, obj.before);
			verbose && console.log(' ALL %s -> before', path);
		}

		// generate routes based
		// on the exported methods
		for (var key in obj) {
			// "reserved" exports
			if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
			// route exports
			switch (key) {
				case 'index':
					method = 'get';
					path = '/';
					break;
				case 'getAllOccurrences':
					method = 'get';
					path = '/api/' + name + '/alloccurrences/:' + '_name';
					break;
				case 'loadInitialData':
					method = 'get';
					path = '/api/' + name + '/resumedata';
					break;
				case 'getLocationTreeData':
					method = 'get';
					path = '/api/' + name + '/locationtree';
					break;
				case 'getLocationParamoTreeData':
					method = 'get';
					path = '/api/' + name + '/locationparamotree';
					break;
				case 'suggestLocation':
					method = 'get';
					path = '/api/' + name + '/similar/:' + '_name';
					break;
				case 'suggestLocationByCoordinates':
					method = 'get';
					path = '/api/' + name + '/similar/:' + '_latitude' + '/:' + '_longitude';
					break;
				default:
					throw new Error('unrecognized route: ' + name + '.' + key);
			}
			path = prefix + path;
			app[method](path, obj[key]);
			verbose && console.log(' %s %s -> %s', method.toUpperCase(), path, key);
		}
		// mount the app
		parent.use(app);
	});
};