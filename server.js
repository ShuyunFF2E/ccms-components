/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-11-30
 */

var path = require('path');
var jsonServer = require('json-mock-kuitos');
var webpack = require('webpack');
var config = require('./webpack-dev.config');
var url = require('url');

var app = jsonServer.create();
var compiler = webpack(config);

var apiPrefix = '';
var filename = path.resolve(__dirname, './mock/db.json');

var CUSTOMER_DEFINED_ATTRIBUTES_API_PREFIX = '/cc/customer-defined-attribute';
var headerOptionFn = function() {
	var now = new Date();
	return {
		'X-Caller-Service': 'ea',
		'X-Caller-Timestamp': now.toLocaleString(),
		'X-Caller-Sign': '1'
	};
};
var customerDefinedAttributeServerSetting = {
	host: 'http://api.sh-dev.shuyun.com',
	port: '',
	option: {
		headers: headerOptionFn(),
		forwardPath: function (req) {
			return url.parse(req.originalUrl).path.replace(CUSTOMER_DEFINED_ATTRIBUTES_API_PREFIX, '/custom-property/1.0');
		}
	}
};

var CUSTOMER_PROFILE_API_PREFIX = '/cc/customer-profile/fullView';
var customerProfileServerSetting = {
	host: 'http://qa-jushita-hangzhou-stage-ual.fenxibao.com',
	port: '',
	option: {
		headers: {
			'Content-Type': 'application/graphql'
		},
		forwardPath: function(req) {
			return url.parse(req.originalUrl).path.replace(CUSTOMER_PROFILE_API_PREFIX, '/fullView/1.0/');
		}
	}
};

var customerDefinedAttributeServer = jsonServer.proxy(customerDefinedAttributeServerSetting.host, customerDefinedAttributeServerSetting.port, customerDefinedAttributeServerSetting.option);
var customerProfileServer = jsonServer.proxy(customerProfileServerSetting.host, customerProfileServerSetting.port, customerProfileServerSetting.option);

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
app.use(CUSTOMER_DEFINED_ATTRIBUTES_API_PREFIX + '/*', customerDefinedAttributeServer);
app.use(CUSTOMER_PROFILE_API_PREFIX, customerProfileServer);
app.use(jsonServer.router(apiPrefix, filename));

app.listen(3000, 'localhost', function(err) {
	if (err) {
		console.log(err);
		return;
	}

	console.log('Listening at http://localhost:3000');
});
