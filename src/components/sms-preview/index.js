/**
 * Created by AshZhang on 16/1/29.
 */


import angular from 'angular';
import {FactoryCreator} from 'angular-es-utils';

import SMSPreview from './SMSPreview';

export default angular
	.module('ccms.components.SMSPreview', ['ccms.components.tooltip'])
	.directive('smsPreview', FactoryCreator.create(SMSPreview))
	.name;
