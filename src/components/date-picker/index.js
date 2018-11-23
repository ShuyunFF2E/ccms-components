/**
 * Created by AshZhang on 2016-3-4.
 */


import angular from 'angular';

import ddo from './DatePicker';


export default angular
	.module('ccms.components.datePicker', ['ccms.components.calendar'])
	.directive('ccDatePicker', () => ddo)
	.name;
