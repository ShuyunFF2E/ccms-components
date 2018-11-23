/**
 * Created by AshZhang on 2016/1/18.
 */


import angular from 'angular';

import ddo from './SMSEditor';


export default angular
		.module('ccms.components.smsEditor', [])
		.directive('ccSmsEditor', () => ddo)
		.name;
