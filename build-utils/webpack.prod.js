const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { name, version } = require('../package.json');
const buildOutputDir = path.join(__dirname, '../dist');

module.exports = () => ({
	mode: 'production',
	devtool: 'cheap-source-map',
	entry: {
		'ccms-components': './src/index.js'
	},
	output: {
		path: buildOutputDir,
		filename: '[name].js'
	},
	externals: {
		'angular': 'angular',
		'angular-resource': '\'ngResource\'',
		'angular-ui-router': '\'ui.router\'',
		'ccms-icon': 'ccms-icon'
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true
			}),
			new OptimizeCssAssetsPlugin()
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
				VERSION: JSON.stringify(version)
			}
		}),
		new CleanPlugin([buildOutputDir], {
			root: process.cwd()
		}),
		new webpack.BannerPlugin(`
${name} v${version}
Copyright 2016-present, Shuyun, Inc.
All rights reserved.
		`),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css'
		}),
		new CopyWebpackPlugin([
			{ from: path.join(__dirname, '../index.js'), to: buildOutputDir, toType: 'dir' },
			{ from: path.join(__dirname, '../package.json'), to: buildOutputDir, toType: 'dir' },
			{ from: path.join(__dirname, '../README.md'), to: buildOutputDir, toType: 'dir' },
			{ from: path.join(__dirname, '../src/components/styles/'), to: `${buildOutputDir}/scss`, toType: 'dir' }
		])
	],
	module: {
		rules: [
			{
				test: /\.(sc|c)ss$/,
				use: [
					{ loader: MiniCssExtractPlugin.loader },
					{ loader: 'css-loader', options: { sourceMap: true } },
					{ loader: 'postcss-loader' },
					{ loader: 'resolve-url-loader' },
					{ loader: 'sass-loader', options: { sourceMap: true } }
				],
				exclude: /node_modules/
			}
		]
	}
});
