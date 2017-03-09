'use strict';

// load site routes as a module
const sites = require('./sites');

// concat all the route modules as one, this is how we keep our server script clean!
module.exports = [].concat(sites);