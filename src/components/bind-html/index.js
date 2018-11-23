/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-08
 */
import angular from 'angular';

import controller from './BindHtmlCtrl';

const bindHTMLDDO = {
	name: 'ccBindHtml',
	restrict: 'A',
	controller,
	controllerAs: '$$bindHtmlCtrl',
	bindToController: {
		content: '<ccBindHtml'
	}
};

export default angular.module('ccms.components.bindHtml', [])
	.directive('ccBindHtml', () => bindHTMLDDO)
	.name;
