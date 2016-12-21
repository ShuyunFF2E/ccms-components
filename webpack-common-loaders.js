/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-14
 */

module.exports = [
	{
		test: /\.js$/,
		loaders: ['babel'],
		exclude: /(node_modules|bower_components)/
	},
	{
		// for fucking jquery plugin
		test: /node_modules(\/\\)jquery\.nicescroll\1jquery\.nicescroll\.js/,
		loader: 'imports?define=>false'
	},
	{
		test: /\.tpl\.html$/,
		loader: 'html',
		query: {interpolate: true},
		exclude: /(node_modules|bower_components)/
	},

	{
		test: /\.(jpe?g|png|gif)$/i,
		loaders: [
			'file?hash=sha512&digest=hex&name=[hash:8].[ext]'
		]
	},
	{
		test: /\.(woff|woff2)(\?t=\d+)?$/,
		loader: 'url?limit=10000&mimetype=application/font-woff&prefix=fonts'
	},
	{
		test: /\.ttf(\?t=\d+)?$/,
		loader: 'url?limit=10000&mimetype=application/octet-stream&prefix=fonts'
	},
	{
		test: /\.eot(\?t=\d+)?$/,
		loader: 'url?limit=10000&mimetype=application/vnd.ms-fontobject&prefix=fonts'
	},
	{
		test: /\.svg(\?t=\d+)?$/,
		loader: 'url?limit=10000&mimetype=image/svg+xml&prefix=fonts'
	}

];
