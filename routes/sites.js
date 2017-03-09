'use strict';

// load the handlers from the module and keep the routes clean
const sitehandlers = require('../handlers/site');

module.exports = [{
	// get all the sites from the Mongo
	method : 'GET',
	path : '/sites',
	handler : sitehandlers.getAll
}, {
	// get one site from the mongo
	method : 'GET',
	path : '/sites/{id}',
	handler : sitehandlers.getById
}, {
	// 
	method : 'POST', 
	path : '/sites',
	handler : sitehandlers.create
}, { 
	// update all the information by sites
	method : 'GET',
	path : '/sites/updateAll',
	handler : sitehandlers.updateAll
}];