/**
 * Created by AshZhang on 2016/1/18.
 */


import angular from 'angular';
import {FactoryCreator} from 'angular-es-utils';

import SMSEditor from './SMSEditor';

export default angular
		.module('ccms.components.smsEditor', [])
		.directive('smsEditor', FactoryCreator.create(SMSEditor))
		.name;
