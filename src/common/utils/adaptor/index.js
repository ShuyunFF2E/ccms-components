/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-08-09
 */

import angular from 'angular';

const SERVICE_PREFIX = '$cc';
const DIRECTIVE_PREFIX = 'cc';

const browser = (function() {
	let ua = navigator.userAgent, tem,
		M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return 'IE ' + (tem[1] || '');
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
		if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
	}
	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
	return {
		name: M[0],
		version: M[1]
	};
}());
const browserName = browser.name.toLowerCase();
const compatibleBrowser = browserName === 'firefox' || browserName !== 'safari' && browserName === 'chrome' && Number(browser.version) > 48;

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

	if (compatibleBrowser) {
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

		if (compatibleBrowser) {
			let warned = false;
			// controller 是否初始化过作为 component 是否已被使用的依据
			// 通过 Proxy 给 controller 添加调用钩子
			const controllerProxy = new Proxy(options.controller, {
				apply(target, thisArg, args) {
					if (!warned) {
						warn(msg, 'directive', name);
					}
					warned = true;
					return Function.prototype.apply(target, [thisArg, ...args]);
				}
			});
			controllerProxy.__proxy__ = options.controller;

			options.controller = controllerProxy;
		}

		return originalComponent(name, options);
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

