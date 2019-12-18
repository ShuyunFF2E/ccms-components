const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const bodyParser = require('body-parser');

const { gridData, menuData, shopsData } = require('../mock/mock');
const { version } = require('../package.json');
const publicPath = '/';


module.exports = () => ({
	mode: 'development',
	devtool: 'source-map',
	entry: {
		components: './src/index.js'
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].js',
		publicPath
	},
	devServer: {
		disableHostCheck: true,
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				pathRewrite: { '^/api': '' },
				logLevel: 'debug'
			}
		},
		before(app) {
			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({ extended: false }));

			app.get('/pages/1', (req, res) => {
				res.json(gridData);
			});

			app.get('/menus', (req, res) => {
				res.json(menuData);
			});

			app.get('/shops', (req, res) => {
				res.json(shopsData);
			});
		},
		historyApiFallback: {
			rewrites: [
				{ from: /.*/, to: path.posix.join(publicPath, 'index.html') }
			]
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				VERSION: JSON.stringify(version)
			}
		}),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'demos/index.html',
			favicon: 'demos/favicon.ico'
		})
	],
	module: {
		rules: [
			{
				test: /\.(sc|c)ss$/,
				use: [
					{ loader: 'style-loader' },
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
