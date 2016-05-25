/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-24
 */

import angular from 'angular';

const ddo = {

	restrict: 'A',
	link(scope, element, attr) {

		scope.$watch(attr.ngDomValue, val => {
			element.val(val);
		});
	}

};

export default angular.module('ccms.components.ngDomValue', [])
	.directive('ngDomValue', () => ddo)
	.name;
