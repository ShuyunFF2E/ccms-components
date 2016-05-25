/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-08
 */

import angular from 'angular';

import bindHtml from '../bind-html';
import TipsDirective from './TipsDirective';
import TipsService from './TipsService';

export default angular
	.module('ccms.components.tips', [bindHtml])
	.component('tips', new TipsDirective())
	.service('TipsService', TipsService)
	.name;
