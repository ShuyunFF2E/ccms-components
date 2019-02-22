/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-14
 */
var path = require('path');
module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				loaders: ['babel-loader'],
				exclude: /(node_modules|bower_components)/
			},
			{
				test: /\.js$/,
				enforce: 'pre',
				use: [{
					loader: 'eslint-loader',
					options: {
						emitWarning: true,
						emitError: true,
						formatter: require('eslint-friendly-formatter')
					}
				}],
				exclude: /node_modules/,
				include: [path.join(__dirname, 'src')]
			},
			{
				test: /\.tpl\.html$/,
				use: {
					loader: 'html-loader',
					options: {
						interpolate: true
					}
				},
				exclude: /(node_modules|bower_components)/
			},
			{
				test: /\.(jpe?g|png|gif)$/i,
				loaders: [
					'url-loader?limit=1000'
				]
			},
			{
				test: /\.(woff|woff2)(\?t=\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/font-woff&prefix=fonts'
			},
			{
				test: /\.ttf(\?t=\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/octet-stream&prefix=fonts'
			},
			{
				test: /\.eot(\?t=\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/vnd.ms-fontobject&prefix=fonts'
			},
			{
				test: /\.svg(\?t=\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=image/svg+xml&prefix=fonts'
			}
		]
	}
};
