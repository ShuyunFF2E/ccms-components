/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-19
 */
import '@babel/polyfill'; // 参见 .babelrc useBuiltIns 参数
import 'core-js/modules/es6.regexp.constructor.js';

import angular from 'angular';
import ngSanitize from 'angular-sanitize';

// 组件兼容服务
import adaptor from './common/utils/adaptor';

import LogicComponents from './common/utils';
import UIComponents from './components';

const ccmsComponents = angular.module('ccms.components', [
	adaptor,
	UIComponents,
	LogicComponents,
	ngSanitize
]);

ccmsComponents.version = process.env.VERSION;

export default ccmsComponents.name;

