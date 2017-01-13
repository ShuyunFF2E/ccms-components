/**
 * Created with index.js.js
 * @Author: maxsmu
 * @Homepage: https://github.com/maxsmu
 * @Date: 2016-12-22 PM3:28
 */
import angular from 'angular';

const DDO = {
	restrict: 'A',
	link: (scope, element) => {
		const imgElement = element[0];
		imgElement.onerror = event => {
			event.target.src = scope.ccAltSrc;
		};
	},
	scope: {
		ccAltSrc: '<'
	}
};
export default angular
	.module('components.imgAltSrc', [])
	.directive('ccAltSrc', () => DDO)
	.name;
