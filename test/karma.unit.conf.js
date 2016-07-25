var base = require('./karma.base.conf');

module.exports = function (config) {

	config.set(Object.assign(base, {
		browsers: ['Chrome'],
		reporters: ['mocha']
	}));
};
