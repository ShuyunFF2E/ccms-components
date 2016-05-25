/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-08
 */
import angular from 'angular';
import {Inject, FactoryCreator} from 'angular-es-utils';

function isPromiseLik(object) {
	return object && typeof object.then === 'function';
}


@Inject('$compile')
class BindHtml {

	constructor() {
		this.restrict = 'A';
	}

	link(scope, element, attr) {

		scope.$watch(scope => {
			return scope.$eval(attr.bindHtml);
		}, newTpl => {

			const compile = tpl => {
				element[0].innerHTML = tpl;
				this._$compile(element.contents())(scope);
			};

			if (isPromiseLik(newTpl)) {
				newTpl.then(tpl => compile(tpl));
			} else {
				compile(newTpl);
			}

		});
	}

}

export default angular.module('ccms.components.bindHtml', [])
	.directive('bindHtml', FactoryCreator.create(BindHtml))
	.name;
