/**
 * Created by AshZhang on 16/1/29.
 */


import angular from 'angular';

import ddo from './SMSPreview';


export default angular
	.module('ccms.components.SMSPreview', [])
	.directive('ccSmsPreview', () => ddo)
	.name;
