/**
 * @author fengqiu.wu
 */

import {Inject} from 'angular-es-utils';

@Inject('$compile', '$timeout')
export default class TabContentTransclude {

	constructor() {

		Object.assign(this, {
			restrict: 'A',
			require: '^tabset'
		});

	}

	link($scope, $element, $attrs, $tabset) {

		// 点击tab 设置相关内容
		$scope.$watch('$tabset.active', () => {

			$tabset.tabs.forEach($tab => {
				if (Number($tab.tab.index) === $tabset.active) {
					$element.html('');
					$element.append($tab.tab.contents);
				}
			});

		});
	}

}
