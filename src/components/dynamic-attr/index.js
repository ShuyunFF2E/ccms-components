/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-21
 */

import angular from 'angular';
import {FactoryCreator} from 'angular-es-utils';
import DynamicAttrDirective from './DynamicAttrDirective';

export default angular
	.module('ccms.components.dynamicAttr', [])
	.directive('dynamicAttr', FactoryCreator.create(DynamicAttrDirective))
	.name;
