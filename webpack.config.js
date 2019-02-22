var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var cssNanoCommonOpts = {
	discardComments: {removeAll: true},
	discardDuplicates: true,
	discardOverridden: true,
	discardUnused: true,
	minifyGradients: true
};
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var merge = require('webpack-merge');
var commonModule = require('./webpack-common-loaders');
const { version } = require('./package.json');

module.exports = function(env, argv) {
	const { production } = env;
	return merge(commonModule, {
		mode: production ? 'production' : 'development',

		devtool: production ? 'cheap-source-map' : 'source-map',

		entry: production ? {
			'ccms-components': './src/index.js',
			'ccms-components.min': './src/index.js'
		} : {
			components: ['webpack-hot-middleware/client?path=/__webpack_hmr&reload=true', './src/index.js']
		},

		output: production ? {
			path: path.join(__dirname, 'dist'),
			filename: '[name].js'
		} : {
			path: path.join(__dirname, 'build'),
			filename: '[name].js',
			publicPath: '/' // hot loader publish dir
		},

		externals: production ? {
			'angular': 'angular',
			'angular-resource': '\'ngResource\'',
			'angular-ui-router': '\'ui.router\''
		} : {},

		optimization: production ? {
			minimizer: [
				new UglifyJsPlugin({
					cache: true,
					parallel: true,
					sourceMap: true
				}),
				// 处理extract出来的css
				new OptimizeCssAssetsPlugin({
					assetNameRegExp: /\.css$/g,
					cssProcessor: require('cssnano'),
					cssProcessorOptions: Object.assign({
						core: false,
						map: {
							inline: false
						}
					}, cssNanoCommonOpts),
					canPrint: true
				})
			]
		} : {},

		plugins: production ? [
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('production'),
					VERSION: JSON.stringify(version)
				}
			}),
			new CleanPlugin(['dist']),
			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[id].css'
			})
		] : [
			new webpack.DefinePlugin({
				'process.env': {
					VERSION: JSON.stringify(version)
				}
			}),
			new webpack.HotModuleReplacementPlugin(),
			new BundleAnalyzerPlugin()
		],

		resolve: {
			extensions: ['.js']
		},

		module: {
			rules: [{
				test: /\.(sc|c)ss$/,
				use: [{
					loader: production ? MiniCssExtractPlugin.loader : 'style-loader'
				}, {
					loader: 'css-loader',
					options: {
						sourceMap: true
					}
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
			}]
		}
	});
};
