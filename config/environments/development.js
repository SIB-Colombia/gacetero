var express = require('express')
  , path = require('path')
  , winston = require('winston');
var serveStatic = require('serve-static');
var errorhandler = require('errorhandler');
var jadeAmd = require('jade-amd');

module.exports = function(parent) {
  parent.use(errorhandler());
  parent.use('/gacetero/templates', jadeAmd.jadeAmdMiddleware({views: path.join(__dirname, '/../../app/views/components')}));
	parent.use(serveStatic(path.join(__dirname, '/../../public')));

	logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)()
		]
	});
};
