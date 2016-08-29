/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-21
 */

import angular from 'angular';
import ddo from './DynamicAttrDirective';

export default angular
	.module('ccms.components.dynamicAttr', [])
	.directive('ccDynamicAttr', () => ddo)
	.name;
