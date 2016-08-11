/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-08-09
 */

import angular from 'angular';

const SERVICE_PREFIX = '$cc';
const DIRECTIVE_PREFIX = 'cc';

const upperCaseCamel = word => word.toUpperCase().substr(0, 1) + word.substr(1);

/**
 * deprecated directive shortcut
 */
const genDeprecatedDirective = originalDirective => (name, directiveFactory, msg) => {

	const wrappedDirectiveFactory = (...args) => {

		console.warn(msg || `${name}指令将在下一版本废弃,请使用 ${DIRECTIVE_PREFIX + upperCaseCamel(name)} 指令代替!`);
		directiveFactory(...args);
	};

	return originalDirective.bind(angular)(name, wrappedDirectiveFactory);
};

/**
 * deprecated component shortcut
 */
const genDeprecatedComponent = originalComponent => (name, options, msg) => {

	const fakeNgComponent = originalComponent.bind({
		directive: (name, factory) => {
			return genDeprecatedDirective(name, factory, msg);
		}
	});

	return fakeNgComponent(name, options);
};

/**
 * deprecated service shortcut
 */
const genDeprecatedService = originalService => (name, Service, msg) => {

	return originalService(name, ['$injector', function($injector) {

		console.warn(msg || `${name} 服务将在下一版本废弃,请使用 ${SERVICE_PREFIX + upperCaseCamel(name)} 服务代替!`);
		return $injector.instantiate(Service);
	}]);
};

/**
 * deprecated value shortcut
 */
const genDeprecatedValue = originalValue => (name, val, msg) => {

	return originalValue(name, () => {

		console.warn(msg || `${name} 服务将在下一版本废弃,请使用 ${SERVICE_PREFIX + upperCaseCamel(name)} 服务代替!`);
		return val;
	}, false);
};

/**
 * 给module实例新增几个deprecated方法
 */
const originalModule = angular.module;
angular.module = (...args) => {

	const moduleInstance = originalModule(...args);
	moduleInstance.deprecatedDirective = genDeprecatedDirective(moduleInstance.directive);
	moduleInstance.deprecatedComponent = genDeprecatedComponent(moduleInstance.component);
	moduleInstance.deprecatedService = genDeprecatedService(moduleInstance.service);
	moduleInstance.deprecatedValue = genDeprecatedValue(moduleInstance.value);

	return moduleInstance;
};

