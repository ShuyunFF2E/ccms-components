/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-11
 */

import angular from 'angular';
import {Inject, FactoryCreator} from 'angular-es-utils';

@Inject('$parse')
class NgEnter {

	constructor($parse) {
		this.$parse = $parse;
		this.require = '?ngModel';
	}

	compile(element, attr) {

		const fn = this.$parse(attr['ngEnter'], null, true);
		const ENTER_KEY_CODE = 13;

		// link function
		return (scope, element, attr, ngModelController) => {

			const callback = event => {

				if (event.keyCode === ENTER_KEY_CODE) {
					scope.$apply(() => {
						fn(scope, {$event: event, $ngModelCtrl: ngModelController});
					});
				}
			};

			element.on('keyup', callback);

			// 使用enter事件触发方式就不再需要input触发的方式(解除ngModel绑定的事件)
			element.off('input change compositionstart compositionend');

			// unbind event listener
			scope.$on('$destroy', () => {
				element.off('keyup', callback);
			});

		};

	}

}

export default angular
	.module('ccms.components.ngEnter', [])
	.directive('ngEnter', FactoryCreator.create(NgEnter))
	.name;
