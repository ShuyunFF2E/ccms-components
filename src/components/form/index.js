/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-17
 */

import angular from 'angular';
import {FactoryCreator} from 'angular-es-utils';

import ValidatorsDirective from './validators/ValidatorsDirective';
import ValidatorDirective from './validator/ValidatorDirective';
import ValidatorService from './validator/ValidatorService';

export default angular
	.module('ccms.components.form', [])
	.directive('validators', FactoryCreator.create(ValidatorsDirective))
	.directive('validator', FactoryCreator.create(ValidatorDirective))
	.service('$Validator', ValidatorService)
	.name;
