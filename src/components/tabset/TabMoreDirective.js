/**
 * @author fengqiu.wu
 */

import {Inject} from 'angular-es-utils';


@Inject()
export default class TabDirControl {

	constructor() {
		this.restrict = 'A';
		this.scope = true;
	}

	link(scope, element, attrs) {
		let tabsetHeader = element.parent()[0];
		let tabset = tabsetHeader.querySelector('.tabset-tab');
		let fixedSize = tabsetHeader.offsetWidth;
		let position = 0;
		let contentSize = 0;

		scope.init = dir => {
			fixedSize = tabsetHeader.offsetWidth;
			contentSize = tabset.offsetWidth;

			const show = contentSize - fixedSize > 0;
			show ? element.addClass('active') : element.removeClass('active');
			scope.status(dir);
		};

		scope.dirControl = dir => {
			scope.status(dir);
		};

		scope.status = dir => {
			contentSize = tabset.offsetWidth;

			let maxLatex = -(contentSize - fixedSize + element[0].offsetWidth);

			if (dir) {
				if (dir > 0) {
					position += fixedSize;
				} else if (dir < 0) {
					position -= fixedSize;
				}

				if (position >= 0) {
					position = 0;
				} else if (position < maxLatex) {
					position = -(contentSize - fixedSize + element[0].offsetWidth);
				}
			}

			element.removeClass('not-back not-forward');
			position >= 0 ? element.addClass('not-back') : position <= maxLatex && element.addClass('not-forward');

			dir !== 0 && lateX(tabsetHeader.querySelector('.tabset-tab'), position);
		};

		scope.$watch(attrs.tabDirControl, () => {
			scope.init(0);
		});

		window.removeEventListener('resize', scope.init, false);
		window.addEventListener('resize', scope.init, false);
	}
}

function lateX(ele, value) {
	let latex = `translateX(${value}px)`;
	ele.style.cssText = `-webkit-transform: ${latex}; -moz-transform: ${latex}; transform: ${latex};`;
}
