/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-09-07
 */

import angular from 'angular';
import 'jquery.nicescroll';
import { Bind, Inject, Debounce } from 'angular-es-utils/decorators';

import browser from '../../common/utils/browser';

const $ = window.NiceScroll.getjQuery();

@Inject('$element')
class Controller {

	$postLink() {
		if (browser.os !== 'MacOS') {
			this.niceScroll = $(this._$element).niceScroll(this.options ||
				{
					cursorwidth: '7px',
					cursorcolor: '#808080',
					mousescrollstep: 200
				});

			// 内容发生变更时重算滚动条
			this._$element[0].addEventListener('DOMSubtreeModified', this.resize, false);

		}
	}

	$onDestroy() {
		if (this.niceScroll) {
			this.niceScroll.remove();
			this._$element[0].removeEventListener('DOMSubtreeModified');
		}
	}

	@Bind
	@Debounce(100)
	resize() {
		this.niceScroll.resize();
	}

}

const ddo = {
	restrict: 'A',
	controller: Controller,
	controllerAs: '$$niceScroll',
	bindToController: {
		options: '<?ccNiceScroll'
	}
};

export default angular
	.module('ccms.components.niceScroll', [])
	.directive('ccNiceScroll', () => ddo)
	.name;

