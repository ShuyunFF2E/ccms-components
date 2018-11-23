/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-06
 */

import injector from 'angular-es-utils/injector';

const TEMPLATE_REGEXP = /<.+>/;

export default (scope, element) => {

	const baseScope = scope.baseScope;
	Object.setPrototypeOf(scope, baseScope);

	if (TEMPLATE_REGEXP.test(scope.column.cellTemplate)) {
		element.html(scope.column.cellTemplate);
	} else {
		element.html(`<span ng-bind="entity.${scope.column.field}"></span>`);
	}

	injector.get('$compile')(element.contents())(scope);

};
