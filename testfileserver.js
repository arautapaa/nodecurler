'use strict';
/*
	This script is used to be like one of the requested sites,
	I don't really want that I would just spam websites
 */

// initialize hapi server
const Hapi = require('hapi');
const server = new Hapi.Server();

// register the inert-module, that is needed in the file serving
server.register([{
	register : require('inert')
}], function(err) {
	// initialize server connection
	server.connection({ host : 'localhost', port: '7777' });

	// init the only route
	server.route({
		method : 'GET',
		path : '/{file}',
		handler : function(request, reply) {
			reply.file('./testsites/' + request.params.file);
		}
	})

	// and then start the server
	server.start(function() {
		console.log('Node curler server is now running at %s', server.info.uri);
	});
});