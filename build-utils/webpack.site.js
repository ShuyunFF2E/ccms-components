const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const buildOutputDir = path.join(__dirname, '../cloud-angular-site');

module.exports = () => ({
	mode: 'production',
	devtool: 'cheap-source-map',
	entry: {
		'components': './src/index.js'
	},
	output: {
		path: buildOutputDir,
		filename: '[name].js'
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
		new CleanPlugin([buildOutputDir], {
			root: process.cwd()
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css'
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'demos/index.html',
			favicon: 'demos/favicon.ico'
		}),
		new CopyWebpackPlugin([
			{ from: path.join(__dirname, '../demos/**/*'), to: buildOutputDir, toType: 'dir' },
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
