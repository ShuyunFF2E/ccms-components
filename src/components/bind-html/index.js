/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-08
 */
import angular from 'angular';

import controller from './BindHtmlCtrl';

const bindHTMLDDO = {
	restrict: 'A',
	controller,
	controllerAs: '$bindHtmlCtrl',
	bindToController: {
		content: '<bindHtml'
	}
};

export default angular.module('ccms.components.bindHtml', [])
	.directive('bindHtml', () => bindHTMLDDO)
	.name;
