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
		test: /\.html$/,
		loader: 'html',
		query: {interpolate: true},
		exclude: /(node_modules|bower_components)/
	},
	{
		test: /\.css$/,
		loaders: ['style', 'css?modules', 'postcss', 'resolve-url'],
		exclude: /(node_modules|bower_components)/
	},
	{
		test: /\.scss$/,
		loaders: ['style', 'css', 'postcss', 'resolve-url', 'sass?sourceMap'],
		exclude: /(node_modules|bower_components)/
	},
	{
		test: /\.(jpe?g|png|gif|svg)$/i,
		loaders: [
			'file?hash=sha512&digest=hex&name=[hash:8].[ext]',
			'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
		]
	},
	{
		test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
		loader: 'url?limit=10000&mimetype=application/font-woff&prefix=fonts'
	},
	{
		test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
		loader: 'url?limit=10000&mimetype=application/octet-stream&prefix=fonts'
	},
	{
		test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
		loader: 'url?limit=10000&mimetype=application/vnd.ms-fontobject&prefix=fonts'
	},
	{
		test: /\.svg(#\w+)?$/,
		loader: 'url?limit=15000&mimetype=image/svg+xml&prefix=fonts'
	}

];
