/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-18
 */

import angular from 'angular';
import {FactoryCreator} from 'angular-es-utils';

import IndeterminateDirective from './IndeterminateDirective';

export default angular
	.module('ccms.components.checkbox', [])
	.directive('indeterminate', FactoryCreator.create(IndeterminateDirective))
	.name;
