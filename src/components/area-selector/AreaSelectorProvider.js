import { platforms, localStorageKeys } from './Constant';

export default function AreaSelectorProvider() {

	let _ual = null;
	let _platform = null;

	this.configSetting = (ual, platform = 'all') => {
		_ual = ual;
		_platform = platform;
	};

	this.$get = init;

	function init($http) {
		return {
			initData: function() {
				if (_ual && _platform) {
					if (_platform === 'all') {
						getData($http, 'jd');
						getData($http, 'tb');
					} else {
						getData($http, _platform);
					}
				} else {
					console.info('如果地区选择器要使用后端数据, 请配置 ual 参数, 见方法 AreaSelectorProvider.configSetting');
				}
			}
		};
	}

	function getData(http, plat) {
		http.get(`${_ual}?platform=${platforms[plat]}`)
			.then(res => {
				localStorage.setItem(localStorageKeys[plat], JSON.stringify(res.data));
			}).catch(err => {
				// require.ensure([], function(require) {
				// 	const areas = require(`./${plat}Areas.json`);
				// 	localStorage.setItem(localStorageKeys[plat], angular.toJson(areas));
				// });
				console.error(err);
			});
	}

	init.$inject = ['$http'];
}
