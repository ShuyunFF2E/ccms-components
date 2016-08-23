/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-08-09
 */

import angular from 'angular';

const SERVICE_PREFIX = '$cc';
const DIRECTIVE_PREFIX = 'cc';

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

const directiveAdaptorHookBlocks = [];
const genDirectiveAdaptorHook = (name, msg) => $injector => {
	// 获取指令的第一个实例(第一个实例的compile方法被调用即说明该指令被调用)
	const directive = $injector.get(`${name}Directive`)[0];

	// $$bindings 初始化发生在指令第一次被添加的时候,所以这里采用 $$bindings 作为初始化判断依据
	let $$bindings = directive.$$bindings;
	Object.defineProperty(directive, '$$bindings', {
		get() {
			return $$bindings;
		},

		set(value) {
			warn(msg, 'directive', name);
			$$bindings = value;
		}
	});
};

/**
 * deprecated directive shortcut
 * only support module.directive(name, factoryFn) definition
 */
const genDeprecatedDirective = originalDirective => (name, directiveFactory, msg) => {

	directiveAdaptorHookBlocks.push(genDirectiveAdaptorHook(name, msg));

	const wrappedDirectiveFactory = (...args) => {
		const ddo = directiveFactory(...args);
		// 复制 ddo 避免跟非 deprecated 用同一个配置引用
		return angular.copy(ddo);
	};

	return originalDirective(name, wrappedDirectiveFactory);
};

/**
 * deprecated component shortcut
 */
const genDeprecatedComponent = originalComponent => {

	return (name, options, msg) => {

		directiveAdaptorHookBlocks.push(genDirectiveAdaptorHook(name, msg));

		// 复制 ddo 避免跟非 deprecated 用同一个配置引用
		return originalComponent(name, angular.copy(options));
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

export default angular
	.module('ccms.components.adaptor', [])
	.run(['$injector', $injector => {
		directiveAdaptorHookBlocks.forEach(hook => hook($injector));
	}])
	.name;
