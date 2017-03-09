'use strict';

const async = require('async');
const request = require('request');
const cheerio = require('cheerio');

module.exports = {	
	/**
	 * This is the main function of the application.
	 *
	 * Its purpose is to scrape information from multiple sites
	 * and parse the response into valuable information 
	 *
	 * For example I would use this like getting all the gigs that are going in the different venues
	 *
	 * It still might be a bit 'callbackhellish'
	 * 
	 * @param  {Array} sites 	Array of sites that we want to spam
	 * @param  {Object} req   	Request object of the Hapi framework
	 * @param  {Function} reply Function of Hapi framework to tell the browser / call that everything is now fine
	 */
	fetchBySites : function(sites, req, reply) {
		// initialize mongo db connection
		const db = req.server.plugins['hapi-mongodb'].db;
		// loop through the sites
		async.map(sites, function(site, callback) {

			// do the request to the wanted url
			request(site.url, function(err, response, body) {
				// check if the response is ok
				if(!err && response.statusCode == 200) {

					console.log("Requested successfully the URL: %s", site.url);

					// hooray, it was ok, lets start parsing
					
					// load the DOM
					const $ = cheerio.load(body);

					const entries = $(site.entryselector);

					// loop through the entries
					async.map(entries, function(entry, callback) {

						// init the parsed entry object
						const parsedentry = {};
						// and tell what was the site of it
						parsedentry.site = site._id;

						// get the attributes
						const attributes = site.attributes;

						// loop through the attributes
						async.map(attributes, function(attribute, callback) {
							// get the value from the DOM
							const value = $(entry).find(attribute.selector).html();

							// and save it
							parsedentry[attribute.name] = value;

							callback(parsedentry);
						}, function(err, results) {
							// when all the attributes are loaded, let's save it to the mongodb
							db.collection('entries').save(parsedentry, function(err, result) {
								// and then, inform the outer loop that we are done completely
								callback(null, parsedentry);
							});
						});

					}, function(err, results) {
						callback(null, results);
					});
				} else {
					// okay, something went wrong in the curling, or the status wasnt OK
					console.log("Error occured while requesting %s, got status code: %s", site.url, response.statusCode); 
					// give empty response
					callback(null);
				}
			});
		}, function(err, results) {
			// send the response to the browser / caller
			reply(results);
		});
	}
}