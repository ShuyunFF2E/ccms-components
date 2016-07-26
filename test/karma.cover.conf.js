/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-25
 */

var base = require('./karma.base.conf');

module.exports = function (config) {

	var opts = Object.assign(base, {
		browsers: ['Chrome'],
		reporters: ['mocha', 'coverage'],
		coverageReporter: {
			reporters: [
				{type: 'lcov', dir: './coverage', subdir: '.'},
				{type: 'text-summary', dir: './coverage', subdir: '.'}
			]
		}
	});

	opts.singleRun = true;

	opts.webpack.module.postLoaders = [
		{
			test: /\.js$/,
			exclude: /node_modules|__tests__|test/,
			loader: 'istanbul-instrumenter'
		}
	];

	config.set(opts);
};
