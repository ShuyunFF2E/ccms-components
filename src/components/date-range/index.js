/**
 * Created by AshZhang on 2016-3-4.
 */


import angular from 'angular';

import ddo from './DateRange';


export default angular
		.module('ccms.components.dateRange', ['ccms.components.datePicker'])
		.directive('ccDateRange', () => ddo)
		.name;
