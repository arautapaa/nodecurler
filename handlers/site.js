'use strict';

const curler = require('../helpers/curler')

module.exports = {
	/**
	 * Simple open interface to get all the sites that are saved in the Mongo DB
	 * @param  {Object} 	req 	request object 
	 * @param  {Function} 	reply 	reply function of the Hapi
	 */
	getAll : function(req, reply) {
		const db = req.server.plugins['hapi-mongodb'].db;

		// find all sites from the mongo
		db.collection('sites').find().toArray(function(err, sites) {
			// error occured, let's inform
			if(err) {
				return reply(err);
			} 

			// inform about success
			return reply(sites);
		});

	},
	/**
	 * Simple open interface to get one site from the Mongo DB
	 * @param  {Object} 	req 	request object 
	 * @param  {Function} 	reply 	reply function of the Hapi
	 */
	getById : function(req, reply) {
		const db = req.server.plugins['hapi-mongodb'].db;
		const ObjectID = req.server.plugins['hapi-mongodb'].ObjectID

		db.collection('sites').findOne({id : new ObjectID(req.params.id)}, function(err, result) {
			// error occured, let's inform
			if(err) {
				return reply(err);
			}

			return reply(result);
		});
	},
	/**
	 * Simple open interface to save one site to the Mongo DB
	 * @param  {Object} 	req 	request object 
	 * @param  {Function} 	reply 	reply function of the Hapi
	 */
	create : function(req, reply) {

		const db = req.server.plugins['hapi-mongodb'].db;
		
		const site = JSON.parse(req.payload.json);

		db.collection('sites').save(site, function(err, result) {
			if(err) {
				return reply(err);
			}

			return reply(result);
		})
	},

	updateAll : function(req, reply) {
		const db = req.server.plugins['hapi-mongodb'].db;

		// all the entries are now dropped
		// TODO:
		// 
		// Do not drop, only update if exists etc.
		db.collection('entries').drop(function(err) {
			// after drop, find the sites and then do the magic
			db.collection('sites').find().toArray(function(err, sites) {
				curler.fetchBySites(sites, req, reply);
			});
		})
	}
}