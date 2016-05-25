/**
 * Created by AshZhang on 2016-3-5.
 */


import angular from 'angular';
import { FactoryCreator } from 'angular-es-utils';

import Calendar from './Calendar';

export default angular
	.module('ccms.components.calendar', [])
	.directive('calendar', FactoryCreator.create(Calendar))
	.name;
