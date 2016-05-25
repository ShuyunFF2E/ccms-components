/**
 * Created by AshZhang on 2016-3-4.
 */


import angular from 'angular';
import { FactoryCreator } from 'angular-es-utils';

import DatePicker from './DatePicker';

export default angular
		.module('ccms.components.datePicker', ['ccms.components.calendar'])
		.directive('datePicker', FactoryCreator.create(DatePicker))
		.name;
