/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-09-07
 */

import angular from 'angular';
import 'jquery.nicescroll';
import { Inject } from 'angular-es-utils/decorators';

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
		}
	}

	$onDestroy() {
		if (this.niceScroll) {
			this.niceScroll.remove();
		}
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

