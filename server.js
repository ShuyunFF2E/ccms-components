/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-11-30
 */

var path = require('path');
var jsonServer = require('json-mock-kuitos');
var webpack = require('webpack');
var config = require('./webpack-dev.config');

var app = jsonServer.create();
var compiler = webpack(config);

var apiPrefix = '';
var filename = path.resolve(__dirname, './mock/db.json');

app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: false,
	stats: {
		colors: true,
		cached: false
	},
	publicPath: config.output.publicPath
}));

// redirect root location to demos index
app.use(/\/$/, function(req, res) {
	res.redirect('/demos/index.html');
});

app.use(require('webpack-hot-middleware')(compiler));
app.use(jsonServer.defaults({static: path.resolve(__dirname)}));
app.use(jsonServer.router(apiPrefix, filename));

app.listen(3000, 'localhost', function(err) {
	if (err) {
		console.log(err);
		return;
	}

	console.log('Listening at http://localhost:3000');
});
