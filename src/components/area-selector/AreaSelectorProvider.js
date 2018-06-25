import { platforms, localStorageKeys } from './Constant';

export default function AreaSelectorProvider() {
	this.getAreaData = function(ual, platform = 'tb') {
		fetch(`${ual}?platform=${platforms[platform]}`).then(response => response.json())
			.then(json => {
				localStorage.setItem(localStorageKeys[platform], JSON.stringify(json));
			}).catch(err => {
				console.error(err);
			});
	};
	this.$get = () => {};
}
