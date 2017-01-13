/**
 * Created with index.js.js
 * @Author: maxsmu
 * @Homepage: https://github.com/maxsmu
 * @Date: 2016-12-22 PM3:28
 */
import angular from 'angular';
import link from './img-error.link';

const DDo = {
	restrict: 'A',
	link,
	scope: {
		ccAltSrc: '<'
	}
};
export default angular
	.module('components.imgAltSrc', [])
	.directive('ccAltSrc', () => DDo)
	.name;
