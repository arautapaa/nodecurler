'use strict';

const env = process.env.NODE_ENV;

// initialize hapi server
const Hapi = require('hapi');
const server = new Hapi.Server();

// initialize fs-functions
const fs = require('fs');

// read this config file synchronously because server won't start in all scenarios, if the loading takes long :--)
const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'))[env];

// register all the modules that we want
server.register([{
	register : require('hapi-mongodb'),
	options: config.mongo
}], function(err) {
	
	if(err) {
		console.log(err);
		throw err;
	}

	// initialize server connection
	server.connection({ host : config.connection.host, port: config.connection.port });

	// load the routes
	server.route(require('./routes'));

	// and then start the server
	server.start(function() {
		console.log('Node curler server is now running at %s', server.info.uri);
	});
});

