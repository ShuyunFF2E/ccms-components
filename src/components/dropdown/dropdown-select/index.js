/**
 * @author arzyu
 */

import angular from 'angular';
import ngResource from 'angular-resource';

import { FactoryCreator } from 'angular-es-utils';

import bindHtml from '../../bind-html';
import highlight from '../../../common/utils/highlight';

import dropdownSelect from './DropdownSelect';
import DropdownService from '../DropdownService';

export default angular
	.module('ccms.components.dropdownSelect', [ngResource, bindHtml])
	.directive('dropdownSelect', FactoryCreator.create(dropdownSelect))
	.filter('highlight', highlight)
	.service('dropdownService', DropdownService)
	.name;
