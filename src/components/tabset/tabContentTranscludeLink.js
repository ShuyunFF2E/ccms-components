/**
 * @author fengqiu.wu
 */
import angular from 'angular';
import injector from 'angular-es-utils/injector';

export default function tabContentTranscludeLink(scope, element, attrs, tabset) {

	const $compile = injector.get('$compile');

	scope.active = 0;

	// 点击tab 设置相关内容
	scope.$watch('$parent.$tabset.active', () => {

		scope.active = tabset.active;

		tabset.tabs.forEach(tab => {
			if (Number(tab.index) === tabset.active) {
				if (!tab.pane) {
					let contentWrap = angular.element('<div></div>');
					tab.pane = contentWrap;

					contentWrap.append(tab.tab.contents);
					element.append(contentWrap);

					$compile(contentWrap)(angular.extend(scope, {index: tab.index}));
				} else {
					tab.pane.removeClass('ng-hide');
				}
			} else if (tab.pane) {
				tab.pane.addClass('ng-hide');
			}
		});
	});
}
