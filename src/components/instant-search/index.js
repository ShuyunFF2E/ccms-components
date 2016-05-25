/**
 * @author arzyu
 */

import angular from 'angular';
import ngResource from 'angular-resource';

import {FactoryCreator} from 'angular-es-utils';

import InstantSearch from './InstantSearch';

export default angular
	.module('ccms.components.instantSearch', [ngResource])
	.directive('instantSearch', FactoryCreator.create(InstantSearch))
	.name;

