/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-25
 */

var base = require('./karma.base.conf');

module.exports = function(config) {

	var opts = Object.assign(base, {
		reporters: ['progress', 'coverage-istanbul'],
		coverageReporter: {
			reporters: [
				{type: 'lcov', dir: './coverage', subdir: '.'},
				{type: 'text-summary', dir: './coverage', subdir: '.'}
			]
		}
	});

	opts.singleRun = true;
	opts.files.unshift('../node_modules/babel-polyfill/browser.js');

	opts.webpack.module.rules.push({
		test: /\.js$/,
		enforce: 'post',
		use: {
			loader: 'istanbul-instrumenter-loader',
			options: { esModules: true }
		},
		exclude: /node_modules|__tests__|test/
	});

	config.set(opts);
};

