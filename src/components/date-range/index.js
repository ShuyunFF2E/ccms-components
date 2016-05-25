/**
 * Created by AshZhang on 2016-3-4.
 */


import angular from 'angular';
import { FactoryCreator } from 'angular-es-utils';

import DateRange from './DateRange';

export default angular
		.module('ccms.components.dateRange', ['ccms.components.datePicker'])
		.directive('dateRange', FactoryCreator.create(DateRange))
		.name;
