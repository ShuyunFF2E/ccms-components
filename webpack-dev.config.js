/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-08-06
 */
var path = require('path');
var webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var loaders = require('./webpack-common-loaders');
const { version } = require('./package.json');

loaders.push(
	{
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
	}
);

module.exports = {
	mode: 'development',
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
		new webpack.DefinePlugin({
			'process.env': {
				VERSION: JSON.stringify(version)
			}
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new BundleAnalyzerPlugin()
	],
	resolve: {
		extensions: ['.js']
	},
	module: {
		rules: loaders
	}
};
