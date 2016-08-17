/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-08-09
 */

import angular from 'angular';

import browser from '../browser';

const SERVICE_PREFIX = '$cc';
const DIRECTIVE_PREFIX = 'cc';

const browserName = browser.name.toLowerCase();
const isBrowserCompatible = browserName === 'firefox' || browserName !== 'safari' && browserName === 'chrome' && Number(browser.version) > 48;

const upperCaseCamel = word => word.toUpperCase().substr(0, 1) + word.substr(1);
const warn = (msg, recipe, name) => {

	if (msg) {
		console.warn(msg);
	} else {
		let prefix, recipeCN;

		switch (recipe) {

			case 'service':
				prefix = SERVICE_PREFIX;
				recipeCN = '服务';
				break;
			case 'directive':
				prefix = DIRECTIVE_PREFIX;
				recipeCN = '指令';
				break;
			// no default
		}

		console.warn(msg || `${name} ${recipeCN}将在8.30之后废弃,请尽早使用 ${prefix + upperCaseCamel(name)} ${recipeCN}代替!`);
	}
};

/**
 * deprecated directive shortcut
 * only support module.directive(name, factoryFn) definition
 */
const genDeprecatedDirective = originalDirective => (name, directiveFactory, msg) => {

	const wrappedDirectiveFactory = (...args) => {

		warn(msg, 'directive', name);
		return directiveFactory(...args);
	};

	return originalDirective(name, wrappedDirectiveFactory);
};

/**
 * deprecated component shortcut
 */
const genDeprecatedComponent = originalComponent => {

	if (isBrowserCompatible) {
		// 重写 Function.prototype.toString 方法,使其配合 Proxy 实例的 toString 操作
		// 绕过 eslint
		const originalToString = Function.prototype.toString;
		const $fn = Function;
		$fn.prototype.toString = function() {
			if (this.__proxy__) {
				return originalToString.call(this.__proxy__);
			} else {
				return originalToString.call(this);
			}
		};
	}

	return (name, options, msg) => {

		let counter = 0;
		// component构造出来的工厂函数调用时,options.template会被调用两次
		const factoryCallCount = 2;

		// 创建拷贝,防止共用一个引用
		const copyOptions = angular.copy(options);
		const template = copyOptions.template;
		Object.defineProperty(copyOptions, 'template', {

			get() {

				counter++;
				if (counter === factoryCallCount) {
					warn(msg, 'directive', name);
				}

				return template;
			}
		});

		return originalComponent(name, copyOptions);
	};
};

/**
 * deprecated service shortcut
 */
const genDeprecatedService = originalFactory => (name, Service, msg) => {

	return originalFactory(name, ['$injector', function($injector) {
		warn(msg, 'service', name);
		return $injector.instantiate(Service);
	}]);
};

/**
 * deprecated value shortcut
 */
const genDeprecatedValue = originalProvider => (name, val, msg) => {

	return originalProvider(name, {
		$get: () => {
			warn(msg, 'service', name);
			return val;
		}
	});
};

/**
 * 给module实例新增几个deprecated方法
 */
const originalModule = angular.module;
angular.module = (...args) => {

	const moduleInstance = originalModule(...args);
	moduleInstance.deprecatedDirective = genDeprecatedDirective(moduleInstance.directive);
	moduleInstance.deprecatedComponent = genDeprecatedComponent(moduleInstance.component);
	moduleInstance.deprecatedService = genDeprecatedService(moduleInstance.factory);
	moduleInstance.deprecatedValue = genDeprecatedValue(moduleInstance.provider);

	return moduleInstance;
};

