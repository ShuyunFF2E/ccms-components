/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-08-06
 */
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var cssnano = require('cssnano');
var cssNanoCommonOpts = {
	discardComments: {removeAll: true},
	discardDuplicates: true,
	discardOverridden: true,
	discardUnused: true,
	minifyGradients: true
};
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var loaders = require('./webpack-common-loaders');

loaders.push(
	{
		test: /\.(sc|c)ss$/,
		loader: ExtractTextPlugin.extract('style', 'css?-minimize!postcss!resolve-url!sass?sourceMap'),
		exclude: /(node_modules|bower_components)/
	}
);

module.exports = {
	devtool: 'cheap-source-map',
	entry: {
		'ccms-components': './src/index.js',
		'ccms-components.min': './src/index.js'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},
	externals: {
		'angular': 'angular',
		'angular-resource': '\'ngResource\'',
		'angular-ui-router': '\'ui.router\''
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new CleanPlugin(['dist']),
		new webpack.optimize.UglifyJsPlugin({
			include: /\.min\.js$/,
			minimize: true
		}),
		new ExtractTextPlugin('[name].css'),
		// 处理extract出来的css
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: cssnano({reduceIdents: false}),
			cssProcessorOptions: Object.assign({
				core: false
			}, cssNanoCommonOpts),
			canPrint: true
		}),
		new webpack.optimize.DedupePlugin(),
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
				test: /\.js?$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				include: path.join(__dirname, 'src')
			}
		],
		loaders: loaders
	}
};
