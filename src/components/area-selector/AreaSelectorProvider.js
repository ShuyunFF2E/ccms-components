import { platforms, localStorageKeys } from './Constant';

export default function AreaSelectorProvider() {

	let _ual = null;
	let _platform = null;

	this.configSetting = (ual, platform = 'tb') => {
		_ual = ual;
		_platform = platform;
	};

	this.$get = init;

	function init($http) {
		return {
			initData: function() {
				if (_ual && _platform) {
					$http.get(`${_ual}?platform=${platforms[_platform]}`)
						.then(res => {
							localStorage.setItem(localStorageKeys[_platform], JSON.stringify(res.data));
						}).catch(err => {
							console.error(err);
						});
				} else {
					console.info('如果要使用后端数据, 请配置 ual 参数, 见方法 AreaSelectorProvider.configSetting');
				}
			}
		};
	}

	init.$inject = ['$http'];
}
