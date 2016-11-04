/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-08-06
 */
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var loaders = require('./webpack-common-loaders');
loaders.push(
	{
		test: /\.(sc|c)ss$/,
		loaders: ['style', 'css', 'postcss', 'resolve-url', 'sass?sourceMap'],
		exclude: /(node_modules|bower_components)/
	}
);

module.exports = {
	devtool: 'source-map',
	entry: {
		components: ['webpack-hot-middleware/client?path=/__webpack_hmr&reload=true', './src/index.js']
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].js',
		publicPath: '/' // hot loader publish dir
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	resolve: {
		extensions: ['', '.js']
	},
	eslint: {
		emitWarning: true,
		emitError: true,
		formatter: require('eslint-friendly-formatter')
	},
	postcss: [autoprefixer({browsers: ['Chrome > 35', 'Firefox > 30', 'Safari > 7']})],
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				include: [path.join(__dirname, 'src')]
			}
		],
		loaders: loaders
	}
};
