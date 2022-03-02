let config = require('./base.js');

if(process.env.NODE_ENV==='development'){
	let test = require('./config.test.js');
	config = Object.assign(config,test);
}
if(process.env.NODE_ENV==='production'){
	let pro = require('./config.pro.js');
	config = Object.assign(config,pro);
}
module.exports = config;
