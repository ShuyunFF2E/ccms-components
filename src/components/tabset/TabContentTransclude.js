/**
 * @author fengqiu.wu
 */

import angular from 'angular';
import {Inject} from 'angular-es-utils';

@Inject('$compile')
export default class TabContentTransclude {

	constructor($compile) {

		this.$compile = $compile;

	}

	link(scope, element, attrs) {
		scope.$watch('$tabsetCtrl.current', function() {
			let tab = scope.$tabsetCtrl.current;

			if (tab && tab.templateUrl) {

				element.html(`<ng-include src="'${tab.templateUrl}'"></ng-include>`);
				tab.scope = angular.extend(scope, tab.scope || {});

			} else {

				element.html(tab && tab.content || '');
			}

			this.$compile(element.contents())(tab && tab.scope || scope);
		}.bind(this));
	}

}
