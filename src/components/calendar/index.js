/**
 * Created by AshZhang on 2016-3-5.
 */


import angular from 'angular';

import ddo from './Calendar';


export default angular
	.module('ccms.components.calendar', [])
	.directive('ccCalendar', () => ddo)
	.name;
