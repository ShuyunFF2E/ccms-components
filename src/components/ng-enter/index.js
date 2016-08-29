/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-11
 */

import angular from 'angular';
import injector from 'angular-es-utils/injector';

const ddo = {

	require: '?ngModel',
	compile(element, attr) {

		const $parse = injector.get('$parse');
		const fn = $parse(attr['ngEnter'], null, true);
		const ENTER_KEY_CODE = 13;

		// link function
		return (scope, element, attr, $ngModelCtrl) => {

			const callback = $event => {

				if ($event.keyCode === ENTER_KEY_CODE) {
					scope.$apply(() => {
						fn(scope, {$event, $ngModelCtrl});
					});
				}
			};

			element.on('keyup', callback);

			// unbind event listener
			scope.$on('$destroy', () => {
				element.off('keyup', callback);
			});

		};
	}

};

export default angular
	.module('ccms.components.ngEnter', [])
	.directive('ngEnter', () => ddo)
	.name;
