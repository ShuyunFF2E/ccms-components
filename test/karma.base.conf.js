/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-25
 */

var path = require('path');
var commonMoule = require('../webpack-common-loaders');
var merge = require('webpack-merge');

module.exports = {

	// base path that will be used to resolve all patterns (eg. files, exclude)
	basePath: './',

	// frameworks to use
	// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
	frameworks: ['mocha'],

	client: {
		mocha: {
			timeout: 15000
		}
	},

	// list of files / patterns to load in the browser
	files: [
		'test.index.js'
	],

	// list of files to exclude
	exclude: [],

	// preprocess matching files before serving them to the browser
	// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
	preprocessors: {
		'test.index.js': ['webpack']
	},

	// Webpack
	webpack: merge(commonMoule, {
		mode: 'development',
		devtool: 'eval',
		entry: {
			app: './src/index.js'
		},
		output: {
			path: path.join(__dirname, 'build'),
			filename: '[name].js',
			publicPath: '/' // hot loader publish dir
		},
		module: {
			rules: [{
				test: /\.(sc|c)ss$/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader'
				}, {
					loader: 'postcss-loader'
				}, {
					loader: 'resolve-url-loader'
				}, {
					loader: 'sass-loader',
					options: {
						sourceMap: true
					}
				}],
				exclude: /(node_modules|bower_components)/
			},
			{
				test: /^((?!\.tpl).)*\.html$/,
				loader: 'file-loader?name=[path][name]-[hash:8].[ext]',
				exclude: /(node_modules|bower_components)/,
				include: /src(\/|\\).*(\/|\\)__tests__/
			}]
		}
	}),

	// Webpack middleware
	webpackMiddleware: {
		noInfo: true
	},

	// test results reporter to use
	// possible values: 'dots', 'progress'
	// available reporters: https://npmjs.org/browse/keyword/karma-reporter
	reporters: ['mocha'],

	// web server port
	port: 9876,

	// enable / disable colors in the output (reporters and logs)
	colors: true,

	// level of logging
	// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
	// logLevel: config.LOG_INFO,

	// enable / disable watching file and executing tests whenever any file changes
	autoWatch: true,

	// start these browsers
	// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
	browsers: ['ChromeHeadlessNoSandbox'],
	customLaunchers: {
		ChromeHeadlessNoSandbox: {
			base: 'Chrome',
			flags: [
				'--headless',
				'--no-sandbox',
				'--disable-gpu',
				'--remote-debugging-address=0.0.0.0',
				'--remote-debugging-port=9222',
				'--user-data-dir=/data'
			]
		}
	},

	// Continuous Integration mode
	// if true, Karma captures browsers, runs the tests and exits
	singleRun: false,

	// Concurrency level
	// how many browser should be started simultaneous
	concurrency: Infinity
};
